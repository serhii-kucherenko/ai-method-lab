"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "pack", label: "Create or open a case pack", href: "/packs" },
  { id: "case", label: "Add a thoracic OLF case", href: "/cases" },
  { id: "approach", label: "Configure an OSE approach", href: "/approaches" },
  { id: "outcome", label: "Record outcome measures", href: "/outcomes" },
  { id: "compare", label: "Run OSE vs open laminectomy", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle={`Checklist progress: ${progress} / ${CHECKS.length}`}
    >
      <div className="mb-6 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="h-full bg-[var(--se-teal)] transition-all"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <div>
              <p className="font-medium">{c.label}</p>
              <Link href={c.href} className="text-sm underline text-[var(--se-teal)]">
                Open
              </Link>
            </div>
            <Button
              type="button"
              variant={done[c.id] ? "default" : "outline"}
              onClick={() => setDone((d) => ({ ...d, [c.id]: !d[c.id] }))}
            >
              {done[c.id] ? "Done" : "Mark done"}
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
