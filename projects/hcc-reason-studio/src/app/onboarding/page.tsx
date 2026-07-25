"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "pathways", label: "Create or open a pathway pack", href: "/pathways" },
  { id: "schemas", label: "Define a risk schema", href: "/schemas" },
  { id: "reasoners", label: "Configure a clinical reasoner", href: "/reasoners" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "settings", label: "Set webhook + members", href: "/settings" },
];

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((progress / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist to get a pathway pack ready for soft-sim compare."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {pct}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--studio-mist)]">
          <div
            className="score-bar h-full bg-[var(--hr-wine)]"
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
            <Link
              href={c.href}
              className="text-sm text-[var(--hr-wine)] underline"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
