import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";

const MAX_CHARS      = 8000;
const MAX_BYTES      = 2 * 1024 * 1024;   // refuse to buffer more than 2 MB
const MAX_REDIRECTS  = 3;
const FETCH_TIMEOUT  = 8000;

/* ── SSRF guard ─────────────────────────────────────────────────────────────
   Only http(s) to public, globally-routable hosts. Every hop of a redirect
   chain is re-validated so a public URL cannot bounce to an internal one. */

function isPrivateIPv4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0
    || (a === 169 && b === 254)                 // link-local / cloud metadata
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127)       // CGNAT
    || a >= 224;                                // multicast / reserved
}

function isPrivateIPv6(ip: string): boolean {
  const s = ip.toLowerCase();
  if (s === "::" || s === "::1") return true;
  if (s.startsWith("fc") || s.startsWith("fd")) return true;   // unique local
  if (s.startsWith("fe8") || s.startsWith("fe9") || s.startsWith("fea") || s.startsWith("feb")) return true; // link-local
  const v4 = s.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);         // IPv4-mapped
  return v4 ? isPrivateIPv4(v4[1]) : false;
}

function isPrivateIP(ip: string): boolean {
  const fam = isIP(ip);
  return fam === 4 ? isPrivateIPv4(ip) : fam === 6 ? isPrivateIPv6(ip) : true;
}

async function assertPublicUrl(raw: string): Promise<URL> {
  let u: URL;
  try { u = new URL(raw); } catch { throw new Error("Invalid URL"); }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Only http and https URLs are supported");
  if (u.username || u.password) throw new Error("URLs with credentials are not allowed");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("This address cannot be fetched");
  }
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addresses.length) throw new Error("Could not resolve host");
  if (addresses.some(a => isPrivateIP(a.address))) throw new Error("This address cannot be fetched");
  return u;
}

async function fetchPublic(raw: string): Promise<Response> {
  let url = raw;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const u = await assertPublicUrl(url);
    const res = await fetch(u, {
      headers: { "User-Agent": "HumanaAI/1.0 (human rights assistant)", Accept: "text/html,text/plain;q=0.9,*/*;q=0.1" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      redirect: "manual",
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error("Redirect without location");
      url = new URL(loc, u).toString();
      continue;
    }
    return res;
  }
  throw new Error("Too many redirects");
}

async function readCapped(res: Response): Promise<string> {
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > MAX_BYTES) throw new Error("Page is too large to analyse");
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) { reader.cancel().catch(() => {}); throw new Error("Page is too large to analyse"); }
    chunks.push(value);
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(Buffer.concat(chunks));
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, MAX_CHARS);
}

export async function POST(req: NextRequest) {
  let url: unknown;
  try { ({ url } = await req.json()); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (typeof url !== "string" || url.length > 2048) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetchPublic(url.trim());
    if (!res.ok) {
      return NextResponse.json({ error: `Could not fetch URL (status ${res.status})` }, { status: 400 });
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return NextResponse.json({ text: `[URL: ${url}] — content type "${contentType.split(";")[0]}" could not be extracted as text.`, url });
    }
    const text = htmlToText(await readCapped(res));
    return NextResponse.json({ text, url });
  } catch (e) {
    // Only surface our own validation messages; never leak network/internal errors.
    const msg = e instanceof Error ? e.message : "";
    const safe = /cannot be fetched|Invalid URL|not allowed|not supported|resolve host|too large|redirect/i.test(msg)
      ? msg : "Could not fetch this URL. Please check the address and try again.";
    return NextResponse.json({ error: safe }, { status: 400 });
  }
}
