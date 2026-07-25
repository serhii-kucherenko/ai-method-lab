"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "pack", label: "Create or open a policy pack", href: "/packs" },
  { id: "option", label: "Configure a regulatory option", href: "/options" },
  { id: "country", label: "Add a country cohort", href: "/countries" },
  { id: "survey", label: "Register a survey batch", href: "/surveys" },
  { id: "compare", label: "Run a dual compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / CHECKS.length) * 100),
    [done],
  );

  return (
    <StudioShell title="Onboarding" subtitle="Checklist to get a safety-first policy pack soft-sim running.">
      <p className="mb-4 text-sm font-medium">Progress {progress}%</p>
      <div className="mb-6 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
        <div className="score-bar h-full rounded-full bg-[var(--cp-teal)]" style={{ width: `${progress}%` }} />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) => setDone((d) => ({ ...d, [c.id]: e.target.checked }))}
              />
              {c.label}
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--cp-teal)]">{c.href}</Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
