import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  extractTextFromBuffer,
  getMimeFromFilename,
} from "@/lib/contract-extract";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const paste = formData.get("paste") as string | null;

    let rawText: string;

    if (paste && typeof paste === "string" && paste.trim()) {
      rawText = paste.trim();
    } else if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const mime =
        file.type || getMimeFromFilename(file.name || "file.txt");
      rawText = await extractTextFromBuffer(buffer, mime);
      if (!rawText) {
        return NextResponse.json(
          { error: "No text could be extracted from the file" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Provide either a file upload or paste text" },
        { status: 400 }
      );
    }

    const doc = await prisma.contractDocument.create({
      data: { projectId, rawText },
    });

    return NextResponse.json({
      contract: {
        id: doc.id,
        projectId: doc.projectId,
        uploadedAt: doc.uploadedAt,
      },
    });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
