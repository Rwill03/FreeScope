import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        contractDocuments: { orderBy: { uploadedAt: "desc" } },
        featureRequests: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const latestContract = project.contractDocuments[0];
    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        contractText: latestContract?.rawText ?? null,
        contractUploadedAt: latestContract?.uploadedAt ?? null,
        featureRequests: project.featureRequests.map((fr) => ({
          id: fr.id,
          description: fr.description,
          scopeStatus: fr.scopeStatus,
          totalHours: fr.totalHours,
          totalPrice: fr.totalPrice,
          createdAt: fr.createdAt,
        })),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
