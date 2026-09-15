import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const MAX_MESSAGES      = 20;                 // the client sends at most the last 20
const MAX_BODY_BYTES    = 15 * 1024 * 1024;   // images are base64 data-URLs (files capped at 10 MB client-side)

interface AttachmentPayload {
  type: string;
  name: string;
  content: string;
}

interface MessagePayload {
  role: "user" | "assistant";
  content: string;
  attachments?: AttachmentPayload[];
}

export async function POST(req: NextRequest) {
  try {
    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    const body = await req.json();

    // Support both legacy { message } and new { messages[] }
    const messages: MessagePayload[] = body.messages ??
      [{ role: "user", content: body.message ?? "", attachments: [] }];

    if (!Array.isArray(messages) || messages.length > MAX_MESSAGES ||
        messages.some(m => (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string")) {
      return NextResponse.json({ error: "Invalid message payload" }, { status: 400 });
    }

    const sessionId: string = body.sessionId ?? "anonymous";
    const lang: string      = body.lang ?? "en";

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg.content && !lastMsg.attachments?.length) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ messages, sessionId, lang }),
      signal: AbortSignal.timeout(28000),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Edge function error:", err);
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 503 });
    }

    return NextResponse.json(await res.json());
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
