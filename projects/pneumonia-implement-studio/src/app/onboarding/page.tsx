"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
const CHECKS = [
  { id: "pack", label: "Create or open a district pack", href: "/packs" },
  { id: "district", label: "Add at least one district", href: "/districts" },
  { id: "pathway", label: "Configure a CFIR co-design pathway", href: "/pathways" },
  { id: "fidelity", label: "Record a fidelity measure run", href: "/fidelity" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for implementation analytics leads starting a soft-sim pilot."
    >
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3"
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
            <Link
              href={c.href}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-[var(--studio-gauze-soft)]"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
