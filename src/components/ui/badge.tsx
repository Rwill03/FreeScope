import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" }
>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === "default" && "bg-[hsl(40,15%,92%)] text-[hsl(0,0%,16%)]",
      variant === "secondary" && "bg-[hsl(40,15%,95%)] text-[hsl(0,0%,42%)]",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
