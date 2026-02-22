import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        featureRequests: true,
        contractDocuments: true,
      },
    });

    // Get freelancer profile for hourly rate
    const profile = await prisma.freelancerProfile.findFirst();
    const hourlyRate = profile?.hourlyRate ?? 75;

    // Calculate metrics
    const totalProjects = projects.length;
    const totalFeatures = projects.reduce(
      (sum: number, p) => sum + p.featureRequests.length,
      0
    );

    // Scope breakdown
    const scopeBreakdown = {
      in_scope: 0,
      out_of_scope: 0,
      partial: 0,
    };

    let totalRevenueProtected = 0;
    let totalHoursIdentified = 0;

    projects.forEach((project) => {
      project.featureRequests.forEach((fr) => {
        scopeBreakdown[fr.scopeStatus as keyof typeof scopeBreakdown]++;
        
        // Revenue protected = out-of-scope and partial work that was identified
        if (fr.scopeStatus === "out_of_scope" || fr.scopeStatus === "partial") {
          totalRevenueProtected += fr.totalPrice;
          totalHoursIdentified += fr.totalHours;
        }
      });
    });

    // Estimate time saved (assume 25 minutes per feature request manually analyzed)
    const timeSavedHours = (totalFeatures * 25) / 60; // in hours

    // Recent feature requests (last 10)
    const allFeatureRequests = await prisma.featureRequest.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { name: true },
        },
      },
    });

    // Project breakdown
    const projectInsights = projects.map((p) => {
      const features = p.featureRequests;
      const outOfScope = features.filter(
        (f) => f.scopeStatus === "out_of_scope" || f.scopeStatus === "partial"
      );
      const revenueProtected = outOfScope.reduce(
        (sum: number, f) => sum + f.totalPrice,
        0
      );

      return {
        id: p.id,
        name: p.name,
        featureCount: features.length,
        revenueProtected,
        hasContract: p.contractDocuments.length > 0,
        scopeBreakdown: {
          in_scope: features.filter((f) => f.scopeStatus === "in_scope").length,
          out_of_scope: features.filter((f) => f.scopeStatus === "out_of_scope")
            .length,
          partial: features.filter((f) => f.scopeStatus === "partial").length,
        },
      };
    }).sort((a, b) => b.revenueProtected - a.revenueProtected);

    return NextResponse.json({
      dashboard: {
        summary: {
          totalProjects,
          totalFeatures,
          revenueProtected: totalRevenueProtected,
          timeSavedHours: Math.round(timeSavedHours * 10) / 10,
          hoursIdentified: totalHoursIdentified,
          hourlyRate,
        },
        scopeBreakdown,
        recentActivity: allFeatureRequests.map((fr) => ({
          id: fr.id,
          projectId: fr.projectId,
          projectName: fr.project.name,
          description:
            fr.description.length > 100
              ? fr.description.slice(0, 100) + "…"
              : fr.description,
          scopeStatus: fr.scopeStatus,
          totalPrice: fr.totalPrice,
          totalHours: fr.totalHours,
          createdAt: fr.createdAt.toISOString(),
        })),
        projectInsights,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
