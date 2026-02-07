import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const profile = await prisma.freelancerProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!profile) {
      return NextResponse.json({ profile: null });
    }
    return NextResponse.json({
      profile: {
        id: profile.id,
        role: profile.role,
        yearsExperience: profile.yearsExperience,
        hourlyRate: profile.hourlyRate,
        skills: JSON.parse(profile.skills) as string[],
        createdAt: profile.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { role, yearsExperience, hourlyRate, skills } = body;
    if (
      typeof role !== "string" ||
      typeof yearsExperience !== "number" ||
      typeof hourlyRate !== "number" ||
      !Array.isArray(skills)
    ) {
      return NextResponse.json(
        { error: "Invalid payload: role, yearsExperience, hourlyRate, skills required" },
        { status: 400 }
      );
    }
    const skillsJson = JSON.stringify(skills.map(String));

    const existing = await prisma.freelancerProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let profile;
    if (existing) {
      profile = await prisma.freelancerProfile.update({
        where: { id: existing.id },
        data: {
          role,
          yearsExperience,
          hourlyRate,
          skills: skillsJson,
        },
      });
    } else {
      profile = await prisma.freelancerProfile.create({
        data: {
          role,
          yearsExperience,
          hourlyRate,
          skills: skillsJson,
        },
      });
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        role: profile.role,
        yearsExperience: profile.yearsExperience,
        hourlyRate: profile.hourlyRate,
        skills: JSON.parse(profile.skills) as string[],
        createdAt: profile.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
