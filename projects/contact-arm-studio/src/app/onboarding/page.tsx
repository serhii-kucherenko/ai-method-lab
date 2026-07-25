"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const ITEMS = [
  { id: "honesty", label: "Acknowledge the honesty fence", href: "/honesty" },
  { id: "pack", label: "Review or create a manipulator pack", href: "/manipulators" },
  {
    id: "mask",
    label: "Define a contact plan",
    href: "/contacts",
  },
  {
    id: "sensing",
    label: "Attach tactile and vision sensing cues",
    href: "/sensing",
  },
  {
    id: "compare",
    label: "Run a contact-centric vs vision-only compare",
    href: "/compare",
  },
  { id: "settings", label: "Confirm org in settings", href: "/settings" },
] as const;

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = useMemo(
    () => ITEMS.filter((i) => checked[i.id]).length,
    [checked],
  );
  const pct = Math.round((done / ITEMS.length) * 100);
  const incomplete = ITEMS.filter((i) => !checked[i.id]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist to stand up contact-planning soft-sim."
    >
      <div className="mb-6">
        <div className="text-sm text-slate-500">
          Progress {done}/{ITEMS.length} ({pct}%)
        </div>
        <div className="mt-2 h-2 rounded bg-slate-100">
          <div
            className="h-2 rounded bg-[var(--studio-orange)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {ITEMS.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={(e) =>
                  setChecked((prev) => ({
                    ...prev,
                    [item.id]: e.target.checked,
                  }))
                }
              />
              {item.label}
            </label>
            <Link
              href={item.href}
              className="text-sm text-[var(--studio-orange)] underline"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
      {incomplete.length ? (
        <p className="mt-6 text-sm text-slate-500">
          Incomplete: {incomplete.map((i) => i.label).join("; ")}.
        </p>
      ) : (
        <p className="mt-6 text-sm text-[var(--studio-orange)]">
          Checklist complete — prepare a soft-sim compare, not a live robot run.
        </p>
      )}
    </StudioShell>
  );
}
