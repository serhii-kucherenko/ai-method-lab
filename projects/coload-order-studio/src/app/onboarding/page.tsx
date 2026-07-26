"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read honesty fence", href: "/honesty" },
  { id: "pack", label: "Open or create a carrier pack", href: "/packs" },
  { id: "carrier", label: "Confirm a carrier pore hint", href: "/carriers" },
  { id: "load", label: "Configure a load sequence", href: "/loads" },
  { id: "assay", label: "Create an assay soft-sim", href: "/assays" },
  { id: "compare", label: "Run ordered vs simultaneous compare", href: "/compare" },
  { id: "export", label: "Export or invite a teammate", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle={`Checklist progress: ${progress} / ${CHECKS.length}`}
    >
      <div className="mb-6 h-2 rounded bg-[var(--co-mist)]">
        <div
          className="score-bar h-2 rounded bg-[var(--co-amber)]"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
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
            <Link href={c.href} className="text-sm underline text-[var(--co-slate)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
