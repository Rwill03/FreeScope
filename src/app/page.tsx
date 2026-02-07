"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

const motionOpt = { opacity: 0, y: 20 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.6 };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: { projects: Project[] }) =>
        setProjects(data.projects ?? [])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <div className="container-narrow px-4 py-20 md:py-28 lg:py-36">
        <motion.div
          initial={motionOpt}
          animate={motionAnimate}
          transition={motionTransition}
        >
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Projects
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[hsl(0,0%,42%)]">
            Create a project, upload a contract or scope document, then evaluate
            feature requests against scope. All estimates are project-centric.
          </p>
          <div className="mt-8">
            <Link href="/project/new">
              <Button>New project</Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <p className="mt-12 text-[hsl(0,0%,42%)]">Loading…</p>
        ) : projects.length === 0 ? (
          <motion.div
            initial={motionOpt}
            animate={motionAnimate}
            transition={{ ...motionTransition, delay: 0.1 }}
          >
            <Card className="mt-12">
              <CardContent className="py-12 text-center text-[hsl(0,0%,42%)]">
                No projects yet. Create one to get started.
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <motion.li
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
              >
                <Link href={`/project/${project.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-md hover:border-[hsl(40,15%,85%)]">
                    <CardHeader className="pb-2">
                      <h2 className="text-xl font-semibold leading-tight">
                        {project.name}
                      </h2>
                      {project.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[hsl(0,0%,42%)]">
                          {project.description}
                        </p>
                      ) : null}
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-3 text-sm text-[hsl(0,0%,42%)]">
                      {project.hasContract ? (
                        <span className="rounded-full bg-[hsl(40,15%,92%)] px-2 py-0.5 text-xs">
                          Scope uploaded
                        </span>
                      ) : (
                        <span className="rounded-full bg-[hsl(20,80%,92%)] px-2 py-0.5 text-xs text-[hsl(20,70%,45%)]">
                          No scope
                        </span>
                      )}
                      <span>
                        {project.featureRequestCount ?? 0} feature
                        {(project.featureRequestCount ?? 0) !== 1 ? "s" : ""}
                      </span>
                      <span>{formatDate(project.createdAt)}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
