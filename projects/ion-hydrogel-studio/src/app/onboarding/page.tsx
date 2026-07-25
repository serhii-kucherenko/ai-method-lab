"use client";

import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  {
    id: "honesty",
    label: "Read honesty fence (membrane / plant / battery)",
    href: "/honesty",
  },
  { id: "pack", label: "Open seed gel pack", href: "/packs" },
  { id: "gel", label: "Review gel network", href: "/gels" },
  { id: "charge", label: "Review charge regulation", href: "/charges" },
  { id: "salt", label: "Review salt run", href: "/salts" },
  { id: "compare", label: "Run first A/B compare", href: "/compare" },
  { id: "settings", label: "Set org webhook + members", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((progress / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for materials / soft-matter electrolyte analytics leads."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">
          Progress {progress} / {CHECKS.length} ({pct}%)
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--ih-sea)]"
            style={{ width: `${pct}%` }}
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
                checked={!!done[item.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [item.id]: e.target.checked }))
                }
              />
              {item.label}
            </label>
            <Link href={item.href}>
              <Button type="button" variant="outline">
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
