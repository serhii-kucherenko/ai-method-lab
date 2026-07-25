"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  {
    id: "honesty",
    label: "Read the honesty fence",
    href: "/honesty",
  },
  {
    id: "agents",
    label: "Create or open an agent pack",
    href: "/agents",
  },
  {
    id: "traces",
    label: "Capture an Arabic CoT trace set",
    href: "/traces",
  },
  {
    id: "distills",
    label: "Add a distill config",
    href: "/distills",
  },
  {
    id: "compare",
    label: "Run distilled vs non-distilled compare",
    href: "/compare",
  },
] as const;

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(() => {
    const n = CHECKS.filter((c) => done[c.id]).length;
    return Math.round((n / CHECKS.length) * 100);
  }, [done]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run Arabic CoT agent soft-sim."
    >
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-2 rounded bg-[var(--aa-green)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <input
              type="checkbox"
              checked={!!done[c.id]}
              onChange={(e) =>
                setDone((d) => ({ ...d, [c.id]: e.target.checked }))
              }
              aria-label={c.label}
            />
            <span className="flex-1">{c.label}</span>
            <Link href={c.href} className="text-sm text-[var(--aa-green)] underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
