"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "pack", label: "Create or open a prompt pack", href: "/prompts" },
  {
    id: "scenarios",
    label: "Configure high-risk psychiatric scenarios",
    href: "/scenarios",
  },
  { id: "gates", label: "Configure structured safety gates", href: "/gates" },
  { id: "run", label: "Capture a soft-sim run", href: "/runs" },
  {
    id: "compare",
    label: "Run structured gates vs prompt-only compare",
    href: "/compare",
  },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((progress / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run therapy-prompt soft-sim."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {pct}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--tp-amber)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
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
            <Link href={c.href} className="text-sm text-[var(--tp-teal)] underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
