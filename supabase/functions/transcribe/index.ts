import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { audio, mimeType, lang } = await req.json() as {
      audio: string;       // base64-encoded audio
      mimeType: string;    // e.g. "audio/webm" or "audio/mp4"
      lang?: string;       // ISO-639-1 code e.g. "en", "ar"
    };

    if (!audio) {
      return new Response(JSON.stringify({ error: "No audio data provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode base64 → binary
    const binary = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
    const ext    = mimeType?.includes("mp4") ? "mp4"
                 : mimeType?.includes("ogg") ? "ogg"
                 : mimeType?.includes("wav") ? "wav"
                 : "webm";

    const audioBlob = new Blob([binary], { type: mimeType ?? "audio/webm" });

    const form = new FormData();
    form.append("file", audioBlob, `recording.${ext}`);
    form.append("model", "whisper-1");
    form.append("response_format", "json");
    // Pass 2-letter ISO language code if available (improves accuracy)
    if (lang) form.append("language", lang.slice(0, 2));

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiApiKey}` },
      body: form,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Whisper API error:", errText);
      return new Response(JSON.stringify({ error: "Transcription failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json() as { text: string };
    return new Response(JSON.stringify({ text: data.text ?? "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Transcribe function error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
