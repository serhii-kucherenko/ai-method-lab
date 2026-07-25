"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "pack", label: "Create or open an exemplar pack", href: "/exemplars" },
  { id: "roi", label: "Curate an ROI config", href: "/rois" },
  { id: "prompt", label: "Add an in-context prompt set", href: "/prompts" },
  { id: "run", label: "Capture a soft-sim run", href: "/runs" },
  { id: "compare", label: "Run A/B compare", href: "/compare" },
  { id: "settings", label: "Invite a teammate in settings", href: "/settings" },
] as const;

export default function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(() => {
    const n = CHECKS.filter((c) => done[c.id]).length;
    return Math.round((n / CHECKS.length) * 100);
  }, [done]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for imaging-AI and VLM product leads."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-2 rounded bg-[var(--re-coral)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
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
            <Link href={c.href} className="text-sm text-[var(--re-coral)] underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
