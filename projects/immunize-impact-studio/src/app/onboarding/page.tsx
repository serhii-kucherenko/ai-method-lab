"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "pack", label: "Create or open an impact pack", href: "/packs" },
  { id: "country", label: "Configure a country panel", href: "/countries" },
  { id: "antigen", label: "Add antigen coverage", href: "/antigens" },
  { id: "panel", label: "Capture a mortality panel run", href: "/panels" },
  { id: "compare", label: "Run A/B compare", href: "/compare" },
  { id: "honesty", label: "Read honesty fence", href: "/honesty" },
  { id: "settings", label: "Invite a teammate in settings", href: "/settings" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle={`Checklist progress ${progress} / ${CHECKS.length} — soft-sim only.`}
    >
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
        <div
          className="h-full bg-[var(--ii-teal)] transition-all"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
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
            <Link href={c.href} className="text-sm underline text-[var(--ii-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
