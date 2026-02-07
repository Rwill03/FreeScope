"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const motionOpt = { opacity: 0, y: 20 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.6 };

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      router.push(`/project/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="container-narrow px-4 py-20 md:py-28">
        <motion.div
          initial={motionOpt}
          animate={motionAnimate}
          transition={motionTransition}
        >
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            New project
          </h1>
          <p className="mt-2 text-base text-[hsl(0,0%,42%)]">
            Create a project, then upload a contract or scope document.
          </p>

          <Card className="mt-8">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Corp — Phase 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief context for the project"
                    rows={3}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </CardContent>
              <div className="px-6 pb-6 md:px-8 md:pb-8">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create project"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
