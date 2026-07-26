"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "pack", label: "Create or open a tubule pack", href: "/packs" },
  { id: "tubule", label: "Add a proximal-tubule / MPS segment", href: "/tubules" },
  { id: "regimen", label: "Configure a voclosporin regimen", href: "/regimens" },
  { id: "assay", label: "Record a mitochondrial assay", href: "/assays" },
  { id: "compare", label: "Run voclosporin vs cyclosporine compare", href: "/compare" },
  { id: "honesty", label: "Read honesty fence before soft-sim lock", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress — finish before locking a soft-sim pack."
    >
      <p className="mb-4 text-sm text-[var(--tm-teal)]">
        Progress: {progress} / {CHECKS.length}
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
        <div
          className="h-full bg-[var(--tm-teal)] transition-all"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
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
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href}>
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
