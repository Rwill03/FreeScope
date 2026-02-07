import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; fid: string }> }
) {
  try {
    const { id: projectId, fid } = await params;
    const fr = await prisma.featureRequest.findFirst({
      where: { id: fid, projectId },
    });
    if (!fr) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      featureRequest: {
        id: fr.id,
        projectId: fr.projectId,
        description: fr.description,
        scopeStatus: fr.scopeStatus,
        totalHours: fr.totalHours,
        totalPrice: fr.totalPrice,
        aiResponse: fr.aiResponse,
        createdAt: fr.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch feature request" },
      { status: 500 }
    );
  }
}
