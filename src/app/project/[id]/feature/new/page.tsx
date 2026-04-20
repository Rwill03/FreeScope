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
import { Progress } from "@/components/ui/progress";

const motionOpt = { opacity: 0, y: 20 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.6 };

type EvaluationStep =
  | "idle"
  | "validating"
  | "evaluating"
  | "saving"
  | "complete";

export default function NewFeaturePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [evaluationStep, setEvaluationStep] = useState<EvaluationStep>("idle");

  const stepProgress: Record<EvaluationStep, number> = {
    idle: 0,
    validating: 25,
    evaluating: 75,
    saving: 90,
    complete: 100,
  };

  const stepLabel: Record<EvaluationStep, string> = {
    idle: "",
    validating: "Validating feature request...",
    evaluating: "AI is evaluating against scope...",
    saving: "Saving evaluation results...",
    complete: "Complete!",
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data: { project?: { name: string } }) =>
        setProjectName(data.project?.name ?? null),
      )
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setEvaluationStep("validating");

    try {
      setEvaluationStep("evaluating");
      // Simulate some processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch(`/api/projects/${id}/feature-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setEvaluationStep("saving");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEvaluationStep("complete");
      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push(`/project/${id}/feature/${data.featureRequest.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setEvaluationStep("idle");
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
            <Link
              href={`/project/${id}`}
              className="hover:text-[hsl(20,70%,55%)]"
            >
              {projectName || "Project"}
            </Link>
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            New feature request
          </h1>
          <p className="mt-2 text-base text-[hsl(0,0%,42%)]">
            The feature will be evaluated against the project scope. Scope
            status and price (if out of scope or partial) will be shown.
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
                    disabled={loading}
                  />
                </div>

                {/* Evaluation Progress */}
                {loading && evaluationStep !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 rounded-lg border border-[hsl(0,0%,90%)] bg-[hsl(40,20%,98%)] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-[hsl(20,70%,55%)] animate-pulse" />
                      </div>
                      <p className="text-sm font-medium text-[hsl(0,0%,16%)]">
                        {stepLabel[evaluationStep]}
                      </p>
                    </div>
                    <Progress value={stepProgress[evaluationStep]} max={100} />
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-200 bg-red-50 p-4"
                  >
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}
              </CardContent>
              <div className="mt-4 px-6 pb-6 md:px-8 md:pb-8">
                <Button type="submit" disabled={loading || !description.trim()}>
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
