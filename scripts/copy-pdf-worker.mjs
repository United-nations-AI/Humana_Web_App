// Copies the pdf.js worker that matches the installed pdfjs-dist version into /public,
// so PDF text extraction never depends on a third-party CDN (and stays within the CSP).
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src  = join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const dest = join(root, "public", "pdf.worker.min.mjs");

if (!existsSync(src)) {
  console.warn("[postinstall] pdfjs-dist worker not found; skipping copy");
} else {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log("[postinstall] copied pdf.worker.min.mjs to /public");
}
