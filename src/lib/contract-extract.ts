async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { createRequire } = await import("module");
  const path = await import("path");
  const { pathToFileURL } = await import("url");
  const projectRequire = createRequire(
    path.default.join(process.cwd(), "package.json")
  );
  const workerPath = projectRequire.resolve(
    "pdfjs-dist/legacy/build/pdf.worker.mjs"
  );
  const workerUrl = pathToFileURL(workerPath).href;

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  }

  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text?.trim() ?? "";
  } finally {
    await parser.destroy().catch(() => {});
  }
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    try {
      return await extractTextFromPdf(buffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("worker") || msg.includes("pdf.worker")) {
        throw new Error(
          "PDF parsing is unavailable in this environment. Please paste the contract text or upload a .txt file instead."
        );
      }
      throw err;
    }
  }
  if (
    mimeType === "text/plain" ||
    mimeType === "text/markdown" ||
    mimeType === "application/json"
  ) {
    return buffer.toString("utf-8").trim();
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}

export function getMimeFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".md")) return "text/markdown";
  if (lower.endsWith(".json")) return "application/json";
  return "text/plain";
}
