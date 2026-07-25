"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  {
    id: "honesty",
    label: "Read the honesty fence (soft-sim only)",
    href: "/honesty",
  },
  {
    id: "pack",
    label: "Create or open a membrane pack",
    href: "/membranes",
  },
  {
    id: "graph",
    label: "Encode a CNT graph config",
    href: "/graphs",
  },
  {
    id: "surrogate",
    label: "Configure a ChemGNN surrogate",
    href: "/surrogates",
  },
  {
    id: "compare",
    label: "Run a ChemGNN vs classical physics compare",
    href: "/compare",
  },
] as const;

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = CHECKS.filter((c) => done[c.id]).length;
  const progress = Math.round((completed / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run ChemGNN membrane soft-sim."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--cm-teal)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{c.label}</p>
              <Link
                href={c.href}
                className="text-sm text-[var(--cm-teal)] underline"
              >
                {c.href}
              </Link>
            </div>
            <Button
              variant={done[c.id] ? "default" : "outline"}
              size="sm"
              onClick={() => setDone((d) => ({ ...d, [c.id]: !d[c.id] }))}
            >
              {done[c.id] ? "Done" : "Mark done"}
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
