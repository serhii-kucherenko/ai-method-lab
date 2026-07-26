"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const ITEMS = [
  { id: "org", label: "Confirm org name in Settings", href: "/settings" },
  { id: "pack", label: "Create or review a response pack", href: "/packs" },
  { id: "event", label: "Configure at least one disaster event", href: "/events" },
  { id: "liaison", label: "Configure a pediatric-perinatal liaison", href: "/liaisons" },
  { id: "handoff", label: "Record a specialty ↔ HQ handoff", href: "/handoffs" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(() => {
    const n = ITEMS.filter((i) => done[i.id]).length;
    return Math.round((n / ITEMS.length) * 100);
  }, [done]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress — get to first dual compare with honesty intact."
    >
      <p className="mb-4 text-sm">
        Progress <span className="font-semibold text-[var(--dl-teal)]">{progress}%</span>
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
        <div
          className="h-full bg-[var(--dl-teal)] transition-all"
          style={{ width: `${progress}%` }}
        />
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
                onChange={() =>
                  setDone((d) => ({ ...d, [item.id]: !d[item.id] }))
                }
              />
              {item.label}
            </label>
            <Link
              href={item.href}
              className="rounded-md border px-2.5 py-1 text-sm hover:bg-[var(--studio-gauze-soft)]"
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
