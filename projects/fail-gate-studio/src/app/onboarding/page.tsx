"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Check = { id: string; label: string; done: boolean; href: string };

export default function OnboardingPage() {
  const [honesty, setHonesty] = useState(false);
  const [hasCase, setHasCase] = useState(false);
  const [hasTax, setHasTax] = useState(false);
  const [hasInsp, setHasInsp] = useState(false);
  const [hasCompare, setHasCompare] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    const [cases, gates, boundaries, compares, settings] = await Promise.all([
      api<{ items: unknown[] }>("/api/cases"),
      api<{ items: unknown[] }>("/api/gates"),
      api<{ items: unknown[] }>("/api/boundaries"),
      api<{ items: unknown[] }>("/api/compare"),
      api<{ org: { name: string } }>("/api/settings"),
    ]);
    setHasCase(cases.items.length > 0);
    setHasTax(gates.items.length > 0);
    setHasInsp(boundaries.items.length > 0);
    setHasCompare(compares.items.length > 0);
    setOrgName(settings.org.name);
  }

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
  }, []);

  const checks: Check[] = useMemo(
    () => [
      {
        id: "honesty",
        label: "Acknowledge soft-sim honesty fence",
        done: honesty,
        href: "/honesty",
      },
      {
        id: "org",
        label: `Confirm org settings (${orgName || "…"})`,
        done: Boolean(orgName),
        href: "/settings",
      },
      {
        id: "case",
        label: "Have at least one fail case",
        done: hasCase,
        href: "/cases",
      },
      {
        id: "tax",
        label: "Attach a gate taxonomy",
        done: hasTax,
        href: "/gates",
      },
      {
        id: "insp",
        label: "Record a boundary inspection",
        done: hasInsp,
        href: "/boundaries",
      },
      {
        id: "compare",
        label: "Run fail-gate vs correctness compare",
        done: hasCompare,
        href: "/compare",
      },
    ],
    [honesty, orgName, hasCase, hasTax, hasInsp, hasCompare],
  );

  const doneCount = checks.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checks.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress for release-gate setup."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>
            {doneCount}/{checks.length} · {pct}%
          </span>
        </div>
        <div className="h-2 rounded bg-slate-200">
          <div
            className="h-2 rounded bg-[var(--studio-teal)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {checks.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm">
              {c.id === "honesty" ? (
                <input
                  type="checkbox"
                  checked={honesty}
                  onChange={(e) => setHonesty(e.target.checked)}
                />
              ) : (
                <input type="checkbox" checked={c.done} readOnly />
              )}
              <span className={c.done ? "text-slate-900" : "text-slate-500"}>
                {c.label}
              </span>
            </label>
            <Button asChild variant="outline" size="sm">
              <Link href={c.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          className="bg-[var(--studio-signal)]"
          onClick={() => refresh().catch((e) => setError(String(e)))}
        >
          Refresh checklist
        </Button>
        <Button asChild variant="outline">
          <Link href="/demo">Guided demo</Link>
        </Button>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
