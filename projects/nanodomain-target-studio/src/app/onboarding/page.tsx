"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "pack", label: "Open or create a therapy pack", href: "/packs" },
  { id: "nano", label: "Configure a nanodomain", href: "/nanodomains" },
  { id: "pep", label: "Configure a peptide pry", href: "/peptides" },
  { id: "assay", label: "Create an assay run", href: "/assays" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "settings", label: "Review org settings / export", href: "/settings" },
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
      subtitle="Checklist with visible progress for first-run cardio soft-sim setup."
    >
      <p className="mb-2 text-sm font-medium">Progress {progress}%</p>
      <div className="mb-8 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--nt-teal)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4"
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
            <Link href={c.href} className="text-sm underline text-[var(--nt-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
