"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOTION_CONFIG, MOTION_LIST_ITEM } from "@/lib/motion";
import { formatCurrency } from "@/lib/number-formatting";
import type { DashboardData } from "@/types";

function ScopeBadge({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  const label =
    statusLower === "in_scope"
      ? "In scope"
      : statusLower === "out_of_scope"
        ? "Out of scope"
        : "Partial";
  const className =
    statusLower === "in_scope"
      ? "bg-green-100 text-green-800"
      : statusLower === "out_of_scope"
        ? "bg-amber-100 text-amber-800"
        : "bg-[hsl(20,80%,92%)] text-[hsl(20,70%,45%)]";
  return <Badge className={className}>{label}</Badge>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((result: { dashboard: DashboardData }) => {
        setData(result.dashboard);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container-wide px-4 py-16 sm:py-20">
          <p className="text-[hsl(0,0%,42%)]">Loading dashboard…</p>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Nav />
        <div className="container-wide px-4 py-16 sm:py-20">
          <p className="text-red-600">Failed to load dashboard</p>
        </div>
      </>
    );
  }

  const { summary, scopeBreakdown, recentActivity, projectInsights } = data;
  const totalAnalyzed = summary.totalFeatures;
  const scopePercentages = {
    in_scope:
      totalAnalyzed > 0
        ? Math.round((scopeBreakdown.in_scope / totalAnalyzed) * 100)
        : 0,
    out_of_scope:
      totalAnalyzed > 0
        ? Math.round((scopeBreakdown.out_of_scope / totalAnalyzed) * 100)
        : 0,
    partial:
      totalAnalyzed > 0
        ? Math.round((scopeBreakdown.partial / totalAnalyzed) * 100)
        : 0,
  };

  return (
    <>
      <Nav />
      <div className="container-narrow px-6 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
        <motion.div
          initial={MOTION_CONFIG.initial}
          animate={MOTION_CONFIG.animate}
          transition={MOTION_CONFIG.transition}
        >
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[hsl(0,0%,42%)]">
            Your freelance business insights - see how FreeScope protects your
            revenue and saves you time.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="bg-gradient-to-br from-[hsl(20,70%,98%)] to-white border-[hsl(20,70%,90%)]">
            <CardHeader className="pb-2">
              <div className="text-sm font-medium text-[hsl(0,0%,42%)]">
                Revenue Protected
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(20,70%,55%)]">
                {formatCurrency(summary.revenueProtected)}
              </div>
              <p className="mt-1 text-xs text-[hsl(0,0%,42%)]">
                Out-of-scope work identified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="text-sm font-medium text-[hsl(0,0%,42%)]">
                Time Saved
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.timeSavedHours}h
              </div>
              <p className="mt-1 text-xs text-[hsl(0,0%,42%)]">
                ~25min per feature analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="text-sm font-medium text-[hsl(0,0%,42%)]">
                Features Analyzed
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.totalFeatures}</div>
              <p className="mt-1 text-xs text-[hsl(0,0%,42%)]">
                Across {summary.totalProjects} project
                {summary.totalProjects !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="text-sm font-medium text-[hsl(0,0%,42%)]">
                Hours Identified
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(summary.hoursIdentified * 10) / 10}h
              </div>
              <p className="mt-1 text-xs text-[hsl(0,0%,42%)]">
                Extra work discovered
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scope Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Scope Analysis Breakdown</h2>
              <p className="text-sm text-[hsl(0,0%,42%)]">
                Distribution of feature requests by scope status
              </p>
            </CardHeader>
            <CardContent>
              {totalAnalyzed === 0 ? (
                <p className="text-sm text-[hsl(0,0%,42%)]">
                  No features analyzed yet. Create a project and add feature
                  requests to see insights.
                </p>
              ) : (
                <>
                  <div className="mb-6 flex h-8 w-full overflow-hidden rounded-lg">
                    <div
                      className="bg-green-500"
                      style={{ width: `${scopePercentages.in_scope}%` }}
                    />
                    <div
                      className="bg-amber-500"
                      style={{ width: `${scopePercentages.out_of_scope}%` }}
                    />
                    <div
                      className="bg-[hsl(20,70%,55%)]"
                      style={{ width: `${scopePercentages.partial}%` }}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="font-medium">In Scope</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold">
                        {scopePercentages.in_scope}%
                      </p>
                      <p className="text-sm text-[hsl(0,0%,42%)]">
                        {scopeBreakdown.in_scope} feature
                        {scopeBreakdown.in_scope !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-medium">Out of Scope</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold">
                        {scopePercentages.out_of_scope}%
                      </p>
                      <p className="text-sm text-[hsl(0,0%,42%)]">
                        {scopeBreakdown.out_of_scope} feature
                        {scopeBreakdown.out_of_scope !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[hsl(20,70%,55%)]" />
                        <span className="font-medium">Partial</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold">
                        {scopePercentages.partial}%
                      </p>
                      <p className="text-sm text-[hsl(0,0%,42%)]">
                        {scopeBreakdown.partial} feature
                        {scopeBreakdown.partial !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Insights */}
        {projectInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold">Project Insights</h2>
            <p className="mt-2 text-sm text-[hsl(0,0%,42%)]">
              Projects ranked by revenue protected
            </p>
            <div className="mt-6 grid gap-4">
              {projectInsights.slice(0, 5).map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={MOTION_LIST_ITEM.initial}
                  animate={MOTION_LIST_ITEM.animate}
                  transition={MOTION_LIST_ITEM.transition(idx)}
                >
                  <Link href={`/project/${project.id}`}>
                    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{project.name}</h3>
                            {!project.hasContract && (
                              <Badge className="bg-[hsl(20,80%,92%)] text-[hsl(20,70%,45%)]">
                                No scope
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[hsl(0,0%,42%)]">
                            <span>
                              {project.featureCount} feature
                              {project.featureCount !== 1 ? "s" : ""}
                            </span>
                            <span>•</span>
                            <span>
                              {project.scopeBreakdown.in_scope} in scope
                            </span>
                            <span>•</span>
                            <span>
                              {project.scopeBreakdown.out_of_scope +
                                project.scopeBreakdown.partial}{" "}
                              out/partial
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[hsl(20,70%,55%)]">
                            {formatCurrency(project.revenueProtected)}
                          </div>
                          <p className="text-xs text-[hsl(0,0%,42%)]">
                            protected
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <p className="mt-2 text-sm text-[hsl(0,0%,42%)]">
              Latest feature requests analyzed
            </p>
            <div className="mt-6 space-y-3">
              {recentActivity.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={MOTION_LIST_ITEM.initial}
                  animate={MOTION_LIST_ITEM.animate}
                  transition={MOTION_LIST_ITEM.transition(idx)}
                >
                  <Link
                    href={`/project/${activity.projectId}/feature/${activity.id}`}
                  >
                    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-[hsl(0,0%,42%)]">
                                {activity.projectName}
                              </span>
                              <ScopeBadge status={activity.scopeStatus} />
                            </div>
                            <p className="text-sm line-clamp-2">
                              {activity.description}
                            </p>
                          </div>
                          {activity.totalPrice > 0 && (
                            <div className="flex-shrink-0 text-right">
                              <div className="font-semibold text-[hsl(20,70%,55%)]">
                                {formatCurrency(activity.totalPrice)}
                              </div>
                              <div className="text-xs text-[hsl(0,0%,42%)]">
                                {activity.totalHours}h
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {summary.totalProjects === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Card className="py-12">
              <CardContent>
                <p className="text-lg text-[hsl(0,0%,42%)]">
                  No projects yet. Create your first project to start seeing
                  insights.
                </p>
                <Link href="/project/new" className="mt-6 inline-block">
                  <button className="rounded-lg bg-black px-6 py-2 text-white transition-all hover:bg-[hsl(0,0%,20%)]">
                    Create Project
                  </button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}
