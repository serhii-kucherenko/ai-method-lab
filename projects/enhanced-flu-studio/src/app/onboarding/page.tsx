"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { id: "pack", label: "Create or open a program pack", href: "/packs" },
  { id: "country", label: "Configure a country scenario", href: "/countries" },
  { id: "program", label: "Define an EIV program spec", href: "/programs" },
  { id: "outcome", label: "Add an outcome metric run", href: "/outcomes" },
  { id: "compare", label: "Run expanded vs baseline compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / ITEMS.length) * 100),
    [done],
  );

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for vaccine-program analytics leads — progress is local until you export."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
          <div
            className="h-full bg-[var(--ef-teal)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {ITEMS.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3"
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
            <Button asChild variant="outline" size="sm">
              <Link href={item.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
