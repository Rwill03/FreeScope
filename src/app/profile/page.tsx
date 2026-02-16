"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/tag-input";
import { validateRole, validateHourlyRate, validateYearsExperience } from "@/lib/validation";
import { MOTION_CONFIG } from "@/lib/motion";
import type { FreelancerProfile as ProfileType } from "@/types";

const motionOpt = { opacity: 0, y: 20 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.6 };

export default function ProfilePage() {
  const [role, setRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<"saved" | "error" | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data: { profile: ProfileType | null }) => {
        if (data.profile) {
          setRole(data.profile.role);
          setYearsExperience(String(data.profile.yearsExperience));
          setHourlyRate(String(data.profile.hourlyRate));
          setSkills(data.profile.skills || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate inputs
    const roleValidation = validateRole(role);
    if (!roleValidation.valid) {
      setMessage("error");
      return;
    }

    const yearsValidation = validateYearsExperience(yearsExperience);
    if (!yearsValidation.valid) {
      setMessage("error");
      return;
    }

    const rateValidation = validateHourlyRate(hourlyRate);
    if (!rateValidation.valid) {
      setMessage("error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role.trim(),
          yearsExperience: parseInt(yearsExperience, 10) || 0,
          hourlyRate: parseFloat(hourlyRate) || 0,
          skills,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setMessage("saved");
    } catch {
      setMessage("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container-narrow px-4 py-20 md:py-28">
          <p className="text-[hsl(0,0%,42%)]">Loading profile…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="container-narrow px-4 py-20 md:py-28 lg:py-36">
        <motion.div
          initial={MOTION_CONFIG.initial}
          animate={MOTION_CONFIG.animate}
          transition={MOTION_CONFIG.transition}
        >
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Freelancer profile
          </h1>
          <p className="mt-2 text-base leading-relaxed text-[hsl(0,0%,42%)]">
            Your role, rate, and skills are used to generate estimates.
          </p>

          <Card className="mt-8">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Full-stack developer"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="years">Years of experience</Label>
                    <Input
                      id="years"
                      type="number"
                      min={0}
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly rate (EUR)</Label>
                    <Input
                      id="rate"
                      type="number"
                      min={0}
                      step={0.01}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="85"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <TagInput value={skills} onChange={setSkills} />
                </div>
                {message === "saved" && (
                  <p className="text-sm text-[hsl(20,70%,45%)]">Profile saved.</p>
                )}
                {message === "error" && (
                  <p className="text-sm text-red-600">Failed to save. Try again.</p>
                )}
              </CardContent>
              <div className="px-6 pb-6 md:px-8 md:pb-8">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save profile"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
