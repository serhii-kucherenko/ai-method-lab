"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

const CHECKS = [
  { id: "pack", label: "Create or confirm a care pack", href: "/packs" },
  { id: "cohort", label: "Add a cohort soft-sim", href: "/cohorts" },
  { id: "module", label: "Add a module path", href: "/modules" },
  { id: "session", label: "Log a session run", href: "/sessions" },
  { id: "compare", label: "Run one A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [packs, cohorts, modules, sessions, compares] = await Promise.all([
          api<{ total: number }>("/api/packs"),
          api<{ total: number }>("/api/cohorts"),
          api<{ total: number }>("/api/modules"),
          api<{ total: number }>("/api/sessions"),
          api<{ items: unknown[] }>("/api/compare"),
        ]);
        setDone({
          pack: packs.total > 0,
          cohort: cohorts.total > 0,
          module: modules.total > 0,
          session: sessions.total > 0,
          compare: compares.items.length > 0,
          honesty: true,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run geriatric care soft-sim setup."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <p className="mb-4 text-sm text-[var(--aw-sage)]">
        {progress} / {CHECKS.length} complete
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--aw-sage)]"
          style={{ width: `${(progress / CHECKS.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <span>
              {done[c.id] ? "✓ " : "○ "}
              {c.label}
            </span>
            <Link href={c.href} className="text-sm underline text-[var(--aw-sage)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
