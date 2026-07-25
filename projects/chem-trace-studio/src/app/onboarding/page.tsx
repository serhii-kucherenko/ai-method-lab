"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "workflows", label: "Create or open a workflow pack", href: "/workflows" },
  { id: "rules", label: "Define a trace-state rule", href: "/rules" },
  { id: "recoveries", label: "Configure a recovery action", href: "/recoveries" },
  { id: "compare", label: "Run a soft-sim A/B compare", href: "/compare" },
] as const;

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist to reach a first typed-trace vs ungated agent compare."
    >
      <p className="mb-4 text-sm">
        Progress {progress} / {CHECKS.length}
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--ct-teal)]"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-3">
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
            <Button asChild variant="outline" size="sm">
              <Link href={c.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
