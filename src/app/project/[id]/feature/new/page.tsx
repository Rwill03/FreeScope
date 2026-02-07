"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const motionOpt = { opacity: 0, y: 20 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.6 };

export default function NewFeaturePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data: { project?: { name: string } }) =>
        setProjectName(data.project?.name ?? null)
      )
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}/feature-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");
      router.push(`/project/${id}/feature/${data.featureRequest.id}`);
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
          <p className="text-sm text-[hsl(0,0%,42%)]">
            <Link href={`/project/${id}`} className="hover:text-[hsl(20,70%,55%)]">
              {projectName || "Project"}
            </Link>
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            New feature request
          </h1>
          <p className="mt-2 text-base text-[hsl(0,0%,42%)]">
            The feature will be evaluated against the project scope. Scope status
            and price (if out of scope or partial) will be shown.
          </p>

          <Card className="mt-8">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Feature description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the feature in detail. What should it do? Any constraints or tech notes?"
                    rows={6}
                    required
                    className="min-h-[160px]"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </CardContent>
              <div className="px-6 pb-6 md:px-8 md:pb-8">
                <Button type="submit" disabled={loading}>
                  {loading ? "Evaluating…" : "Evaluate against scope"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
