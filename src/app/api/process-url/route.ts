import { NextRequest, NextResponse } from "next/server";

const MAX_CHARS = 8000;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "HumanaAI/1.0 (human rights assistant)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Could not fetch URL (status ${res.status})` }, { status: 400 });
    }

    const contentType = res.headers.get("content-type") ?? "";
    let text = "";

    if (contentType.includes("text/html") || contentType.includes("text/plain")) {
      const html = await res.text();
      // Strip HTML tags
      text = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s{2,}/g, " ")
        .trim()
        .slice(0, MAX_CHARS);
    } else {
      text = `[URL: ${url}] — Content type "${contentType}" could not be extracted as text.`;
    }

    return NextResponse.json({ text, url });
  } catch (e) {
    const msg = (e as Error).message ?? "Failed to fetch URL";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
