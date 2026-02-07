"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FeatureRequestDetail, ScopeAIResult } from "@/types";

const motionOpt = { opacity: 0, y: 20 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.6 };

function ScopeBadge({ status }: { status: string }) {
  const label =
    status === "in_scope"
      ? "In scope"
      : status === "out_of_scope"
        ? "Out of scope"
        : "Partially in scope";
  const className =
    status === "in_scope"
      ? "bg-green-100 text-green-800"
      : status === "out_of_scope"
        ? "bg-amber-100 text-amber-800"
        : "bg-[hsl(20,80%,92%)] text-[hsl(20,70%,45%)]";
  return (
    <Badge className={className}>
      {label}
    </Badge>
  );
}

export default function FeatureResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const fid = params.fid as string;
  const [feature, setFeature] = useState<FeatureRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !fid) return;
    fetch(`/api/projects/${id}/feature-requests/${fid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: { featureRequest: FeatureRequestDetail }) =>
        setFeature(data.featureRequest)
      )
      .catch(() => setError("Not found"))
      .finally(() => setLoading(false));
  }, [id, fid]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container-wide px-4 py-20">
          <p className="text-[hsl(0,0%,42%)]">Loading…</p>
        </div>
      </>
    );
  }

  if (error || !feature) {
    return (
      <>
        <Nav />
        <div className="container-wide px-4 py-20">
          <p className="text-red-600">{error || "Not found"}</p>
          <Button variant="secondary" className="mt-4" onClick={() => router.push("/")}>
            Back to projects
          </Button>
        </div>
      </>
    );
  }

  let parsed: ScopeAIResult | null = null;
  try {
    parsed = JSON.parse(feature.aiResponse) as ScopeAIResult;
  } catch {
    // keep null
  }

  const showPricing =
    feature.scopeStatus === "out_of_scope" || feature.scopeStatus === "partial";

  return (
    <>
      <Nav />
      <div className="container-wide px-4 py-20 md:py-28">
        <motion.div
          initial={motionOpt}
          animate={motionAnimate}
          transition={motionTransition}
          className="mb-8"
        >
          <p className="text-sm text-[hsl(0,0%,42%)]">
            <Link href={`/project/${id}`} className="hover:text-[hsl(20,70%,55%)]">
              Project
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Feature request
          </h1>
          <p className="mt-2 line-clamp-2 text-base text-[hsl(0,0%,42%)]">
            {feature.description}
          </p>
          <div className="mt-4">
            <ScopeBadge status={feature.scopeStatus} />
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card>
              <CardContent className="pt-6 md:pt-8">
                <h2 className="text-xl font-semibold">Scope & breakdown</h2>
                {parsed ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-[hsl(0,0%,42%)]">
                        Scope reasoning
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed">
                        {parsed.scope_reasoning}
                      </p>
                    </div>
                    {parsed.missing_scope_items?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[hsl(0,0%,42%)]">
                          Missing from scope
                        </h3>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                          {parsed.missing_scope_items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {parsed.tasks?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[hsl(0,0%,42%)]">
                          Task breakdown
                        </h3>
                        <ul className="mt-2 space-y-2">
                          {parsed.tasks.map((t, i) => (
                            <li
                              key={i}
                              className="flex justify-between text-sm"
                            >
                              <span>{t.name}</span>
                              <span className="text-[hsl(0,0%,42%)]">
                                {t.hours} h
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {parsed.assumptions?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[hsl(0,0%,42%)]">
                          Assumptions
                        </h3>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                          {parsed.assumptions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[hsl(0,0%,42%)]">
                    No structured breakdown available.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
          >
            <Card className="h-fit">
              <CardContent className="pt-6 md:pt-8">
                <div className="space-y-6">
                  {showPricing ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-[hsl(0,0%,42%)]">
                          Total hours
                        </p>
                        <p className="text-2xl font-semibold">
                          {feature.totalHours} hours
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[hsl(0,0%,42%)]">
                          Price estimate
                        </p>
                        <p className="text-4xl font-semibold tracking-tight text-[hsl(0,0%,16%)]">
                          €
                          {feature.totalPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-[hsl(0,0%,42%)]">
                        Price
                      </p>
                      <p className="text-xl font-semibold text-green-700">
                        Included in scope
                      </p>
                      <p className="mt-1 text-sm text-[hsl(0,0%,42%)]">
                        This feature is covered by the project scope. No
                        additional charge.
                      </p>
                    </div>
                  )}
                  {parsed && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-[hsl(0,0%,42%)]">
                        Confidence
                      </p>
                      <Badge
                        className={
                          parsed.confidence === "high"
                            ? "bg-green-100 text-green-800"
                            : parsed.confidence === "low"
                              ? "bg-amber-100 text-amber-800"
                              : ""
                        }
                      >
                        {parsed.confidence}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex gap-4">
                  <Link href={`/project/${id}/feature/new`}>
                    <Button>New feature request</Button>
                  </Link>
                  <Link href={`/project/${id}`}>
                    <Button variant="secondary">Back to project</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
