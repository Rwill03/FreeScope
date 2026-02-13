import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { evaluateScopeAndEstimate } from "@/lib/scope-ai";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const list = await prisma.featureRequest.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      featureRequests: list.map((fr) => ({
        id: fr.id,
        description: fr.description,
        scopeStatus: fr.scopeStatus,
        totalHours: fr.totalHours,
        totalPrice: fr.totalPrice,
        createdAt: fr.createdAt,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch feature requests" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        contractDocuments: { orderBy: { uploadedAt: "desc" }, take: 1 },
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const contractDoc = project.contractDocuments[0];
    if (!contractDoc?.rawText?.trim()) {
      return NextResponse.json(
        {
          error:
            "No contract/scope document for this project. Upload one first.",
        },
        { status: 400 }
      );
    }

    const profile = await prisma.freelancerProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!profile) {
      return NextResponse.json(
        { error: "No freelancer profile. Create a profile first." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    if (!description) {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 }
      );
    }

    let skills: string[];
    try {
      skills = JSON.parse(profile.skills) as string[];
    } catch {
      console.error("Failed to parse freelancer skills JSON:", profile.skills);
      skills = [];
    }
    const result = await evaluateScopeAndEstimate({
      projectScope: contractDoc.rawText,
      featureDescription: description,
      freelancerHourlyRate: profile.hourlyRate,
      freelancerSkills: skills,
    });

    const featureRequest = await prisma.featureRequest.create({
      data: {
        projectId,
        description,
        scopeStatus: result.scope_status,
        totalHours: result.total_hours,
        totalPrice: result.total_price,
        aiResponse: JSON.stringify(result),
      },
    });

    return NextResponse.json({
      featureRequest: {
        id: featureRequest.id,
        description: featureRequest.description,
        scopeStatus: featureRequest.scopeStatus,
        totalHours: featureRequest.totalHours,
        totalPrice: featureRequest.totalPrice,
        aiResponse: featureRequest.aiResponse,
        createdAt: featureRequest.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
