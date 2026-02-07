import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-[hsl(40,15%,90%)] bg-[hsl(40,20%,97%)] px-3 py-2 text-base leading-relaxed placeholder:text-[hsl(0,0%,42%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(0,0%,12%)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
