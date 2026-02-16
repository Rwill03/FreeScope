/**
 * Skeleton loading component for better UX
 */

import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-md bg-[hsl(40,15%,90%)]", className)}
    {...props}
  />
));
Skeleton.displayName = "Skeleton";

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[hsl(40,15%,90%)] bg-[hsl(40,20%,98%)] p-6 md:p-8 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
