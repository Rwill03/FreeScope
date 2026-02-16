import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[hsl(40,15%,90%)] bg-[hsl(40,20%,98%)] px-3 py-2 text-base transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(0,0%,42%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(0,0%,12%)] focus-visible:ring-offset-2 focus-visible:border-[hsl(0,0%,12%)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
