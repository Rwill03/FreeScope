import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(0,0%,12%)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-[hsl(0,0%,12%)] text-white hover:bg-[hsl(0,0%,18%)]",
          variant === "secondary" &&
            "bg-[hsl(40,15%,92%)] text-[hsl(0,0%,16%)] hover:bg-[hsl(40,15%,88%)]",
          variant === "ghost" &&
            "hover:bg-[hsl(40,15%,95%)] text-[hsl(0,0%,16%)]",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
