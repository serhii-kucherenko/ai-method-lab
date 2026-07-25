"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read soft-sim honesty fence", href: "/honesty" },
  { id: "omics", label: "Open seeded omic pack", href: "/omics" },
  { id: "priors", label: "Review prior set", href: "/priors" },
  { id: "traits", label: "Confirm trait panel", href: "/traits" },
  { id: "compare", label: "Run priors-informed vs free compare", href: "/compare" },
  { id: "settings", label: "Check org / export / webhook", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((progress / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run multi-omics leads."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}/{CHECKS.length} ({pct}%)</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div className="score-bar h-full bg-[var(--op-teal)]" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <input
              type="checkbox"
              checked={!!done[c.id]}
              onChange={(e) => setDone({ ...done, [c.id]: e.target.checked })}
              aria-label={c.label}
            />
            <span className="flex-1">{c.label}</span>
            <Link href={c.href} className="text-sm text-[var(--op-teal)] underline">{c.href}</Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
