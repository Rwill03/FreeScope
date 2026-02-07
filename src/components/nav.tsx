"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Projects" },
  { href: "/profile", label: "Profile" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-[hsl(40,15%,90%)] bg-[hsl(40,20%,98%)]">
      <div className="container-wide px-4 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[hsl(0,0%,16%)]"
          >
            FreeScope
          </Link>
          <div className="flex gap-4">
            {links.map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/" || pathname.startsWith("/project")
                  : pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[hsl(20,70%,55%)]",
                    isActive ? "text-[hsl(0,0%,16%)]" : "text-[hsl(0,0%,42%)]"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
