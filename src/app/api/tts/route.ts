import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const MAX_TTS_CHARS     = 4096; // OpenAI TTS input limit; the client already trims to 4000

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    if (text.length > MAX_TTS_CHARS) {
      return NextResponse.json({ error: "Text is too long for speech" }, { status: 413 });
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("TTS edge function error:", err);
      return NextResponse.json({ error: "TTS service unavailable" }, { status: 503 });
    }

    return NextResponse.json(await res.json());
  } catch (e) {
    console.error("TTS API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
