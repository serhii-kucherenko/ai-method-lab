"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type ChecklistKey = "org" | "match" | "hold" | "compare" | "honesty";

const ITEMS: {
  key: ChecklistKey;
  label: string;
  href: string;
  hint: string;
}[] = [
  {
    key: "org",
    label: "Confirm org settings",
    href: "/settings",
    hint: "Open settings and save org name if needed.",
  },
  {
    key: "match",
    label: "Create first match candidate",
    href: "/matches",
    hint: "Register a driver–order pair.",
  },
  {
    key: "hold",
    label: "Assign an experience hold",
    href: "/holds",
    hint: "Pick a tier and hold budget.",
  },
  {
    key: "compare",
    label: "Run dual compare",
    href: "/compare",
    hint: "Compare experience-aware vs first-feasible.",
  },
  {
    key: "honesty",
    label: "Acknowledge honesty fence",
    href: "/honesty",
    hint: "Read soft-sim limits — not live marketplace control.",
  },
];

const STORAGE_KEY = "hms-onboarding-v1";

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>({
    org: false,
    match: false,
    hold: false,
    compare: false,
    honesty: false,
  });
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setChecked((prev) => ({ ...prev, ...JSON.parse(raw) }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const doneCount = useMemo(
    () => ITEMS.filter((i) => checked[i.key]).length,
    [checked],
  );
  const pct = Math.round((doneCount / ITEMS.length) * 100);

  function toggle(key: ChecklistKey) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function seedFirstMatch() {
    setError("");
    try {
      const match = await api<{ id: string }>("/api/matches", {
        method: "POST",
        body: JSON.stringify({
          orderLabel: "ORD-ONBOARD",
          driverLabel: "DRV-ONBOARD",
          zone: "Onboarding",
          status: "open",
        }),
      });
      await api("/api/holds", {
        method: "POST",
        body: JSON.stringify({
          matchId: match.id,
          tier: "hold_short",
          holdBudgetSec: 12,
          status: "active",
        }),
      });
      setChecked((prev) => ({ ...prev, match: true, hold: true }));
      setSeeded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress."
    >
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>
            {doneCount}/{ITEMS.length} ({pct}%)
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="score-bar h-full bg-[var(--studio-amber)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {ITEMS.map((item) => (
          <li
            key={item.key}
            className="flex flex-wrap items-start gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={checked[item.key]}
              onChange={() => toggle(item.key)}
              aria-label={item.label}
            />
            <div className="flex-1">
              <Link
                href={item.href}
                className="font-medium text-slate-900 underline-offset-2 hover:underline"
              >
                {item.label}
              </Link>
              <p className="text-sm text-slate-500">{item.hint}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={seedFirstMatch}>Seed demo match + hold</Button>
        {seeded ? (
          <span className="text-sm text-[var(--studio-teal)]">
            Seeded — mark compare and honesty when ready.
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </StudioShell>
  );
}
