"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "pack", label: "Create or open a risk pack", href: "/packs" },
  { id: "scenario", label: "Configure a CMIP6 scenario", href: "/scenarios" },
  { id: "species", label: "Add a vector species niche", href: "/species" },
  { id: "population", label: "Attach a population overlay", href: "/populations" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for climate-surveillance leads standing up a dengue thermal-suitability soft-sim pack."
    >
      <p className="mb-6 text-sm text-[var(--ds-teal)]">
        Progress {progress} / {CHECKS.length}
      </p>
      <div className="mb-4 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--ds-teal)]"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[item.id]}
                onChange={(e) => setDone((d) => ({ ...d, [item.id]: e.target.checked }))}
              />
              {item.label}
            </label>
            <Link href={item.href} className="text-sm underline text-[var(--ds-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
      <Button type="button" className="mt-6" variant="outline" onClick={() => setDone({})}>
        Reset checklist
      </Button>
    </StudioShell>
  );
}

export default OnboardingPage;
