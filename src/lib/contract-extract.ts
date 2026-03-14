async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text?.trim() ?? "";
  } catch (err) {
    throw new Error(
      `Failed to extract text from PDF: ${err instanceof Error ? err.message : String(err)}`
    );
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
