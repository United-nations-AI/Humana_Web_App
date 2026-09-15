import type { Attachment } from "@/types/chat";
import { uuid } from "./uuid";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function processFile(file: File): Promise<Attachment> {
  if (file.size > MAX_SIZE) throw new Error(`File too large (max 10 MB): ${file.name}`);

  const id   = uuid();
  const name = file.name;
  const mime = file.type;

  // Images
  if (mime.startsWith("image/")) {
    const content = await toBase64(file);
    return { id, type: "image", name, content, mimeType: mime, size: file.size };
  }

  // PDFs
  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    const content = await extractPdfText(file);
    return { id, type: "pdf", name, content, mimeType: mime, size: file.size };
  }

  // Plain text / markdown / csv / json / code
  if (
    mime.startsWith("text/") ||
    ["application/json","application/csv"].includes(mime) ||
    /\.(txt|md|csv|json|js|ts|py|html|css|xml|yaml|yml)$/i.test(name)
  ) {
    const content = await file.text();
    return { id, type: "text", name, content, mimeType: mime, size: file.size };
  }

  // Word docs — read as text (best effort)
  if (
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.(doc|docx)$/i.test(name)
  ) {
    const content = `[Word document: ${name}]\nNote: Full Word document parsing requires conversion. Please copy and paste the text content directly for best results.`;
    return { id, type: "text", name, content, mimeType: mime, size: file.size };
  }

  // Fallback: try reading as text
  try {
    const content = await file.text();
    return { id, type: "text", name, content: content.slice(0, 8000), mimeType: mime, size: file.size };
  } catch {
    throw new Error(`Unsupported file type: ${file.name}`);
  }
}

export function isValidUrl(str: string): boolean {
  try { new URL(str); return str.startsWith("http"); } catch { return false; }
}

// ── helpers ──

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function extractPdfText(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    // Self-hosted worker (copied from node_modules by the postinstall script) — no third-party CDN.
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const buffer = await file.arrayBuffer();
    const pdf    = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
    }
    return text.trim() || "[PDF: no extractable text found]";
  } catch {
    return `[PDF: ${file.name} — text extraction failed. Please copy-paste the content.]`;
  }
}
