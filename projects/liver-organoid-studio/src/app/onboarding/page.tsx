"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "pack", label: "Create or open a model pack", href: "/packs" },
  { id: "model", label: "Register an HLO/HLC model", href: "/models" },
  { id: "lineage", label: "Configure a lineage mix", href: "/lineages" },
  { id: "assay", label: "Record an assay soft-sim", href: "/assays" },
  { id: "masld", label: "Add a MASLD phenotype case", href: "/masld" },
  { id: "compare", label: "Run HLO vs HLC compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const progress = useMemo(() => {
    const n = CHECKS.filter((c) => done[c.id]).length;
    return Math.round((n / CHECKS.length) * 100);
  }, [done]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for organoid-platform leads standing up MASLD soft-sim packs."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--lo-teal)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4"
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href}>
              <Button type="button" variant="outline">
                Go
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
