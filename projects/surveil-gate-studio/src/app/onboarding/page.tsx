"use client";
import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "pack", label: "Create a surveillance pack", href: "/packs" },
  { id: "pillar", label: "Configure a governance pillar", href: "/pillars" },
  { id: "policy", label: "Add a policy recipe", href: "/policies" },
  { id: "signal", label: "Open a signal batch", href: "/signals" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;
  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist to stand up your first surveillance-governance soft-sim."
    >
      <p className="mb-4 text-sm">
        Progress: {progress} / {CHECKS.length}
      </p>
      <div className="h-2 w-full max-w-md overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--sg-teal)]"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="mt-6 space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border bg-white p-4"
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone({ ...done, [c.id]: e.target.checked })
                }
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href} className="text-sm text-[var(--sg-teal)] underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
