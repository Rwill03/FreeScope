/**
 * Empty state components for better UX
 */

import Link from "next/link";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[hsl(40,15%,90%)] bg-[hsl(40,20%,98%)] p-8 text-center sm:p-12">
      <h3 className="text-lg font-semibold text-[hsl(0,0%,16%)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[hsl(0,0%,42%)]">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function NoProjectsEmpty() {
  return (
    <EmptyState
      title="No projects yet"
      description="Create a project to start managing scope and features. Projects help you organize estimates and track feature requests."
      action={{ label: "Create your first project", href: "/project/new" }}
    />
  );
}

export function NoFeatureRequestsEmpty() {
  return (
    <EmptyState
      title="No feature requests"
      description="Start adding feature requests after you've uploaded your project scope or contract. Each request will be evaluated against your original scope."
    />
  );
}

export function NoContractEmpty() {
  return (
    <EmptyState
      title="No scope uploaded"
      description="Upload your project contract or scope document to start evaluating feature requests. You can paste text, upload a PDF, or use a text file."
    />
  );
}
