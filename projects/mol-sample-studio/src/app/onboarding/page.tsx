"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  {
    id: "honesty",
    label: "Read the honesty fence (soft-sim, not wet-lab, not live ELN)",
    href: "/honesty",
  },
  {
    id: "campaign",
    label: "Create or open a campaign pack",
    href: "/campaigns",
  },
  {
    id: "target",
    label: "Define a property target",
    href: "/targets",
  },
  {
    id: "optimizer",
    label: "Configure a sample-efficient optimizer",
    href: "/optimizers",
  },
  {
    id: "compare",
    label: "Run an A/B compare",
    href: "/compare",
  },
];

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((progress / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist to first sample-efficient vs naive compare."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {pct}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--studio-porcelain)]">
          <div
            className="score-bar h-full bg-[var(--ms-accent)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              {c.label}
            </label>
            <Button asChild variant="outline" size="sm">
              <Link href={c.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
