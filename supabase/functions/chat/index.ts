import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Attachment { type: string; name: string; content: string; }
interface HistoryMessage { role: "user" | "assistant"; content: string; attachments?: Attachment[]; }

function buildContent(content: string, attachments?: Attachment[]) {
  if (!attachments?.length) return content;

  const parts: unknown[] = [];
  if (content) parts.push({ type: "text", text: content });

  for (const att of attachments) {
    if (att.type === "audio") continue; // transcript already in message content
    if (att.type === "image") {
      parts.push({ type: "image_url", image_url: { url: att.content, detail: "auto" } });
    } else {
      parts.push({ type: "text", text: `\n\n[Attached ${att.type.toUpperCase()}: ${att.name}]\n${att.content.slice(0, 6000)}` });
    }
  }
  return parts;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl      = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey      = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey     = Deno.env.get("OPENAI_API_KEY")!;
    const supabase         = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    // Support both legacy single-message and new history format
    const history: HistoryMessage[] = body.messages ??
      [{ role: "user", content: body.message ?? "", attachments: [] }];

    const sessionId: string = body.sessionId ?? "anonymous";
    const lang: string      = body.lang ?? "en";

    const LANG_NAMES: Record<string, string> = {
      en: "English", ar: "Arabic", fr: "French",
      es: "Spanish", zh: "Chinese (Simplified)", hi: "Hindi",
    };
    const langName = LANG_NAMES[lang] ?? "English";

    if (!history.length) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch DB config
    const [{ data: cfg }, { data: promptData }, { data: guardrails }] = await Promise.all([
      supabase.from("ai_config").select("*").eq("is_active", true).single(),
      supabase.from("system_prompts").select("content").eq("is_active", true).order("version", { ascending: false }).limit(1).single(),
      supabase.from("guardrails").select("rule").eq("is_active", true),
    ]);

    const config = cfg ?? { model: "gpt-4o-mini", max_tokens: 1024, temperature: 0.7 };

    const defaultPrompt = `You are Humana AI, a specialized human rights assistant created by Qatar CPD. Provide free, accurate, accessible information about human rights, international law, and humanitarian issues.

You are knowledgeable about the UDHR, ICCPR, ICESCR, UN Refugee Convention, Geneva Conventions, and all major international human rights instruments.

CORE PRINCIPLES:
1. Accurate, balanced information grounded in international human rights law
2. Treat all humans with equal dignity
3. Explain complex legal concepts clearly for non-experts
4. Recommend professional legal advice for specific cases
5. Never take partisan political positions
6. Always stand for universal human rights principles
7. When users share documents or images, analyse them in the context of human rights

Always respond in a clear, structured format. Use markdown for lists and headings.`;

    const guardrailText = guardrails?.length
      ? "\n\nGUARDRAILS (never violate):\n" + guardrails.map((g: { rule: string }, i: number) => `${i+1}. ${g.rule}`).join("\n")
      : "";

    // Language instruction — ensures the AI responds in the user's selected UI language.
    // If the user writes in a different language, still honour the UI language so the
    // TTS voice and the rest of the interface stay consistent.
    const langInstruction = `\n\nLANGUAGE: You MUST respond exclusively in ${langName}. Do not switch languages even if the user writes in another language. All explanations, headings, lists, and text must be in ${langName}.`;

    const systemPrompt = (promptData?.content ?? defaultPrompt) + guardrailText + langInstruction;

    // Use gpt-4o for vision requests (when any message has image attachments)
    const hasImages = history.some(m => m.attachments?.some(a => a.type === "image"));
    const model = hasImages ? "gpt-4o" : config.model;

    // Build OpenAI messages
    const oaiMessages = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({
        role: m.role,
        content: buildContent(m.content, m.attachments),
      })),
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiApiKey}` },
      body: JSON.stringify({
        model,
        max_tokens: config.max_tokens,
        temperature: config.temperature,
        messages: oaiMessages,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI error:", err);
      return new Response(JSON.stringify({ error: "AI model error. Please try again." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const oaiData  = await openaiRes.json();
    const response = oaiData.choices?.[0]?.message?.content ?? "I couldn't generate a response. Please try again.";
    const tokens   = oaiData.usage?.total_tokens ?? null;

    // Log (best-effort, non-blocking)
    const lastUserMsg = [...history].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const threadId = UUID_RE.test(sessionId) ? sessionId : null;
      supabase.from("chat_logs").insert({
        session_id:   sessionId,
        thread_id:    threadId,   // typed UUID column — powers /chat/[threadId] lookups
        user_message: lastUserMsg.content || "(attachment)",
        ai_response:  response,
        model_used:   model,
        tokens_used:  tokens,
      }).then(() => {}).catch((e: Error) => console.error("Log error:", e));
    }

    return new Response(JSON.stringify({ response, tokens_used: tokens }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
