import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const MAX_AUDIO_BYTES   = 25 * 1024 * 1024; // OpenAI Whisper upload limit

export async function POST(req: NextRequest) {
  try {
    const form      = await req.formData();
    const audioFile = form.get("audio") as File | null;
    const lang      = (form.get("lang") as string | null) ?? "en";

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }
    if (audioFile.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Recording is too long (max 25 MB)" }, { status: 413 });
    }
    if (!/^[a-z]{2}$/.test(lang)) {
      return NextResponse.json({ error: "Invalid language code" }, { status: 400 });
    }

    // Convert audio blob → base64 for JSON transport to Supabase Edge Function
    const buffer = await audioFile.arrayBuffer();
    const base64  = Buffer.from(buffer).toString("base64");

    const res = await fetch(`${SUPABASE_URL}/functions/v1/transcribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        audio:    base64,
        mimeType: audioFile.type || "audio/webm",
        lang,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Transcribe edge function error:", err);
      return NextResponse.json({ error: "Transcription service unavailable" }, { status: 503 });
    }

    return NextResponse.json(await res.json());
  } catch (e) {
    console.error("Transcribe API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
