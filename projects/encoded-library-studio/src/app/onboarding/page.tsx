"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "packs", label: "Open library packs", href: "/packs" },
  { id: "cycles", label: "Review a construct cycle", href: "/cycles" },
  { id: "hits", label: "Inspect a hit shortlist", href: "/hits" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "settings", label: "Confirm org settings", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / CHECKS.length) * 100),
    [done],
  );

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run DELT soft-sim setup."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div className="score-bar h-full bg-[var(--el-sea)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) => setDone((d) => ({ ...d, [c.id]: e.target.checked }))}
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--el-sea)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
