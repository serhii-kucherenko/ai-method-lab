"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CoverageBar({
  coveragePct,
  className,
}: {
  coveragePct: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, coveragePct));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  return (
    <div
      className={cn(
        "coverage-bar h-2 w-full overflow-hidden rounded-sm bg-[color-mix(in_srgb,var(--color-rule)_18%,transparent)]",
        className,
      )}
      role="img"
      aria-label={`Coverage ${clamped.toFixed(1)} percent`}
    >
      <div
        className="coverage-bar-fill h-full rounded-sm bg-[var(--color-accent)] transition-[width] duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
