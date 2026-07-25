"use client";

import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "panel", label: "Create a panel pack", href: "/panels" },
  { id: "probe", label: "Configure an interpretable probe", href: "/probes" },
  { id: "mechanism", label: "Link a biological mechanism", href: "/mechanisms" },
  { id: "run", label: "Create a variant run", href: "/runs" },
  { id: "compare", label: "Run A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist from first panel pack to honesty-fenced compare."
    >
      <p className="mb-4 text-sm">
        Progress: {progress} / {CHECKS.length}
      </p>
      <div className="mb-4 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--vp-teal)]"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-2">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              {c.label}
            </label>
            <Link
              className="text-sm text-[var(--vp-teal)] underline"
              href={c.href}
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
