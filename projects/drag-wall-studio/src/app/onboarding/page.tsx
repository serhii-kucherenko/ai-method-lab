"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  {
    id: "honesty",
    label: "Read the honesty fence",
    href: "/honesty",
  },
  {
    id: "channels",
    label: "Create or review a channel pack",
    href: "/channels",
  },
  {
    id: "actuators",
    label: "Define a wall actuator plan",
    href: "/actuators",
  },
  {
    id: "sensors",
    label: "Attach a sensor layout",
    href: "/sensors",
  },
  {
    id: "compare",
    label: "Run an ES vs open-loop compare",
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
      subtitle="Checklist to get from channel pack to scored drag compare."
    >
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded bg-slate-100">
          <div
            className="score-bar h-2 rounded bg-[var(--studio-cyan)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone((prev) => ({ ...prev, [c.id]: e.target.checked }))
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
