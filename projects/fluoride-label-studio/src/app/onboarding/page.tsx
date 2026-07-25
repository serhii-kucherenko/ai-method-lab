"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "honesty", label: "Read honesty fence (GMP / cyclotron / clinical dosing)", href: "/honesty" },
  { id: "pack", label: "Open or create a label pack", href: "/packs" },
  { id: "precursor", label: "Configure a precursor scaffold", href: "/precursors" },
  { id: "exchange", label: "Configure an exchange run", href: "/exchanges" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "export", label: "Export packs or compares from Settings", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / CHECKS.length) * 100),
    [done],
  );

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run PET chemistry leads."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--fl-cobalt)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(done[item.id])}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [item.id]: e.target.checked }))
                }
              />
              {item.label}
            </label>
            <Link href={item.href}>
              <Button type="button" variant="outline" size="sm">
                Open
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
