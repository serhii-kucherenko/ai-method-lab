"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "pack", label: "Create or open a birth pack", href: "/packs" },
  { id: "birth", label: "Register at least one caesarean birth", href: "/births" },
  { id: "method", label: "Configure a weighed-swab method", href: "/methods" },
  { id: "assay", label: "Add a haemoglobin assay run", href: "/assays" },
  { id: "compare", label: "Run one A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "settings", label: "Invite a teammate or set webhook", href: "/settings" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = CHECKS.filter((c) => done[c.id]).length;
  const pct = Math.round((completed / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for obstetric analytics leads standing up the soft-sim bench."
    >
      <div className="mb-6">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
          <div
            className="h-full bg-[var(--bl-teal)] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          {completed} / {CHECKS.length} complete ({pct}%)
        </p>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3"
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
            <Link href={c.href} className="text-sm underline text-[var(--bl-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
