"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  {
    id: "org",
    label: "Confirm org name and bearer token in Settings",
    href: "/settings",
  },
  {
    id: "pack",
    label: "Create your first measure pack",
    href: "/measures",
  },
  {
    id: "parser",
    label: "Configure an Optopol/Zeiss parser",
    href: "/parsers",
  },
  {
    id: "export",
    label: "Define a DICOM SR export",
    href: "/exports",
  },
  {
    id: "compare",
    label: "Run a SNOMED vs private-tag A/B compare",
    href: "/compare",
  },
  {
    id: "honesty",
    label: "Acknowledge soft-sim honesty fence",
    href: "/honesty",
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
      subtitle="First-run checklist with visible progress for imaging-data leads."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--tm-teal)]"
            style={{ width: `${progress}%` }}
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
