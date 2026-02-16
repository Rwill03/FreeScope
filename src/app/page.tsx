"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatting";
import { MOTION_CONFIG, MOTION_LIST_ITEM } from "@/lib/motion";
import type { Project } from "@/types";

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
      <div className="container-narrow px-4 py-16 sm:py-20 md:py-28 lg:py-36">
        <motion.div
          initial={MOTION_CONFIG.initial}
          animate={MOTION_CONFIG.animate}
          transition={MOTION_CONFIG.transition}
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
            initial={MOTION_CONFIG.initial}
            animate={MOTION_CONFIG.animate}
            transition={{ ...MOTION_CONFIG.transition, delay: 0.1 }}
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
                initial={MOTION_LIST_ITEM.initial}
                animate={MOTION_LIST_ITEM.animate}
                transition={MOTION_LIST_ITEM.transition(i)}
              >
                <Link href={`/project/${project.id}`} className="group">
                  <Card className="h-full transform-gpu transition-all duration-400 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-95">
                    <CardHeader className="pb-2">
                      <h2 className="text-xl font-semibold leading-tight group-hover:text-[hsl(20,70%,55%)] transition-colors duration-400 ease-in-out">
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
