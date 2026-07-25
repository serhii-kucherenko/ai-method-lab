"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "org", label: "Confirm org settings & bearer token", href: "/settings" },
  { id: "pack", label: "Create or open an atlas pack", href: "/atlases" },
  {
    id: "registrations",
    label: "Configure a registration",
    href: "/registrations",
  },
  {
    id: "quantifications",
    label: "Configure a region quantification",
    href: "/quantifications",
  },
  { id: "compare", label: "Run a dual A/B compare", href: "/compare" },
  { id: "honesty", label: "Ack soft-sim honesty fence", href: "/honesty" },
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
      subtitle="First-run checklist with visible progress for atlas soft-sim."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress: {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--af-teal)]"
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
            <Link
              href={c.href}
              className="text-sm text-[var(--af-teal)] underline"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() =>
            setDone(Object.fromEntries(CHECKS.map((c) => [c.id, true])))
          }
        >
          Mark all complete
        </Button>
      </div>
    </StudioShell>
  );
}

export default OnboardingPage;
