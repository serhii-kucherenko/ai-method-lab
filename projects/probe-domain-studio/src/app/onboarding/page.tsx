"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "pack", label: "Create or open a probe pack", href: "/packs" },
  { id: "probe", label: "Register a probe design", href: "/probes" },
  { id: "domain", label: "Configure a domain split", href: "/domains" },
  { id: "target", label: "Add a target sequence", href: "/targets" },
  { id: "assay", label: "Run an assay soft-sim", href: "/assays" },
  { id: "compare", label: "Run A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((progress / CHECKS.length) * 100);

  return (
    <StudioShell title="Onboarding" subtitle="Checklist with visible progress for first-run probe soft-sim setup.">
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}/{CHECKS.length} ({pct}%)</p>
        <div className="mt-2 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
          <div className="score-bar h-full rounded-full bg-[var(--pd-teal)]" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={() => setDone((d) => ({ ...d, [c.id]: !d[c.id] }))}
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--pd-teal)]">{c.href}</Link>
          </li>
        ))}
      </ul>
      <Button type="button" className="mt-6" onClick={() => setDone({})}>Reset checklist</Button>
    </StudioShell>
  );
}

export default OnboardingPage;
