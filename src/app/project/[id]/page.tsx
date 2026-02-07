"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetail, FeatureRequestListItem } from "@/types";

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

function ScopeBadge({ status }: { status: string }) {
  const label =
    status === "in_scope"
      ? "In scope"
      : status === "out_of_scope"
        ? "Out of scope"
        : "Partially in scope";
  const variant =
    status === "in_scope"
      ? "default"
      : status === "out_of_scope"
        ? "secondary"
        : "default";
  const className =
    status === "in_scope"
      ? "bg-green-100 text-green-800"
      : status === "out_of_scope"
        ? "bg-amber-100 text-amber-800"
        : "bg-[hsl(20,80%,92%)] text-[hsl(20,70%,45%)]";
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: { project: ProjectDetail }) => setProject(data.project))
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (error || !project) {
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

  const hasContract = !!project.contractText?.trim();
  const featureRequests = (project.featureRequests || []) as FeatureRequestListItem[];

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
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {project.name}
          </h1>
          {project.description ? (
            <p className="mt-2 text-base text-[hsl(0,0%,42%)]">
              {project.description}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href={`/project/${id}/feature/new`}>
              <Button disabled={!hasContract}>
                New feature request
              </Button>
            </Link>
            {!hasContract && (
              <span className="text-sm text-[hsl(0,0%,42%)]">
                Upload a contract/scope document first.
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={motionOpt}
            animate={motionAnimate}
            transition={{ ...motionTransition, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contract / scope</CardTitle>
                {project.contractUploadedAt && (
                  <p className="text-sm text-[hsl(0,0%,42%)]">
                    Uploaded {formatDate(project.contractUploadedAt)}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {hasContract ? (
                  <>
                    <div className="max-h-[400px] overflow-y-auto rounded-lg border border-[hsl(40,15%,90%)] bg-[hsl(40,15%,95%)] p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {project.contractText}
                    </div>
                    <ReplaceScope projectId={id} onUpload={() => window.location.reload()} />
                  </>
                ) : (
                  <UploadContract projectId={id} onUpload={() => window.location.reload()} />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={motionOpt}
            animate={motionAnimate}
            transition={{ ...motionTransition, delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Feature requests</CardTitle>
              </CardHeader>
              <CardContent>
                {featureRequests.length === 0 ? (
                  <p className="text-sm text-[hsl(0,0%,42%)]">
                    No feature requests yet. Add one after uploading scope.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {featureRequests.map((fr) => (
                      <li key={fr.id}>
                        <Link href={`/project/${id}/feature/${fr.id}`}>
                          <div className="rounded-lg border border-[hsl(40,15%,90%)] p-3 transition-colors hover:bg-[hsl(40,15%,96%)]">
                            <p className="line-clamp-2 text-sm font-medium">
                              {fr.description.slice(0, 120)}
                              {fr.description.length > 120 ? "…" : ""}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <ScopeBadge status={fr.scopeStatus} />
                              {(fr.scopeStatus === "out_of_scope" ||
                                fr.scopeStatus === "partial") && (
                                <>
                                  <span className="text-xs text-[hsl(0,0%,42%)]">
                                    {fr.totalHours} h · €
                                    {fr.totalPrice.toLocaleString("en-US", {
                                      maximumFractionDigits: 0,
                                    })}
                                  </span>
                                </>
                              )}
                              <span className="text-xs text-[hsl(0,0%,42%)]">
                                {formatDate(fr.createdAt)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function UploadContract({
  projectId,
  onUpload,
}: {
  projectId: string;
  onUpload: () => void;
}) {
  const [paste, setPaste] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const formData = new FormData();
      if (paste.trim()) formData.set("paste", paste.trim());
      if (file) formData.set("file", file);
      const res = await fetch(`/api/projects/${projectId}/contract`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUpload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[hsl(0,0%,16%)]">
          Paste scope or upload PDF / text
        </label>
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="Paste contract or requirements text here…"
          className="mt-2 min-h-[120px] w-full rounded-lg border border-[hsl(40,15%,90%)] bg-[hsl(40,20%,97%)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(0,0%,12%)]"
          rows={4}
        />
      </div>
      <div>
        <input
          type="file"
          accept=".pdf,.txt,.md"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <Button type="submit" disabled={loading || (!paste.trim() && !file)}>
        {loading ? "Uploading…" : "Save scope"}
      </Button>
    </form>
  );
}

function ReplaceScope({
  projectId,
  onUpload,
}: {
  projectId: string;
  onUpload: () => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="text-sm font-medium text-[hsl(20,70%,55%)] hover:underline"
      >
        {show ? "Cancel" : "Replace scope"}
      </button>
      {show && (
        <div className="mt-4">
          <UploadContract projectId={projectId} onUpload={onUpload} />
        </div>
      )}
    </div>
  );
}
