import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contractDocuments: { orderBy: { uploadedAt: "desc" }, take: 1 },
        _count: { select: { featureRequests: true } },
      },
    });
    return NextResponse.json({
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
        hasContract: p.contractDocuments.length > 0,
        featureRequestCount: p._count.featureRequests,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: typeof description === "string" ? description.trim() : "",
      },
    });
    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
