"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "pack", label: "Create or open an exam pack", href: "/packs" },
  { id: "exam", label: "Configure at least one exam", href: "/exams" },
  { id: "pattern", label: "Add a cardiac POCUS pattern", href: "/patterns" },
  { id: "assay", label: "Create a detection assay", href: "/assays" },
  { id: "compare", label: "Run dual A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for POCUS analytics leads — progress is local soft-sim only."
    >
      <p className="mb-4 text-sm text-[var(--cp-teal)]">
        {progress} / {CHECKS.length} complete
      </p>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3"
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={() =>
                  setDone((d) => ({ ...d, [c.id]: !d[c.id] }))
                }
              />
              <span>{c.label}</span>
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

export default OnboardingPage;
