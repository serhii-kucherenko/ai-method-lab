"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKLIST = [
  {
    id: "honesty",
    label: "Read the honesty fence",
    href: "/honesty",
  },
  {
    id: "pack",
    label: "Create or open an accel pack",
    href: "/accels",
  },
  {
    id: "channels",
    label: "Configure wearable channels",
    href: "/channels",
  },
  {
    id: "repr",
    label: "Add a PA representation",
    href: "/representations",
  },
  {
    id: "compare",
    label: "Run a dual A/B compare",
    href: "/compare",
  },
  {
    id: "settings",
    label: "Set org webhook + invite a member",
    href: "/settings",
  },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("accel-pd-onboarding");
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("accel-pd-onboarding", JSON.stringify(next));
      return next;
    });
  }

  const progress =
    CHECKLIST.filter((c) => done[c.id]).length / CHECKLIST.length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress — get to a soft-sim compare without skipping honesty."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">
          Progress {Math.round(progress * 100)}%
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--ap-teal)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKLIST.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(done[c.id])}
                onChange={() => toggle(c.id)}
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href} className="text-sm text-[var(--ap-teal)] underline">
              Open {c.href}
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
