"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type ChecklistKey =
  | "org"
  | "claim"
  | "attest"
  | "compare"
  | "honesty";

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
    key: "claim",
    label: "Create first claim",
    href: "/claims",
    hint: "Register an empirical claim in the registry.",
  },
  {
    key: "attest",
    label: "Attach a tool attestation",
    href: "/attestations",
    hint: "Bind a tool kind to your claim.",
  },
  {
    key: "compare",
    label: "Run dual compare",
    href: "/compare",
    hint: "Compare tool-attested vs fluent-only.",
  },
  {
    key: "honesty",
    label: "Acknowledge honesty fence",
    href: "/honesty",
    hint: "Read soft-sim limits — not Lean 4 / EG-VAR.",
  },
];

const STORAGE_KEY = "aps-onboarding-v1";

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>({
    org: false,
    claim: false,
    attest: false,
    compare: false,
    honesty: false,
  });
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setChecked({ ...checked, ...JSON.parse(raw) });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function seedFirstClaim() {
    setError("");
    try {
      await api("/api/claims", {
        method: "POST",
        body: JSON.stringify({
          title: "Onboarding seed claim",
          statement: "First-run empirical claim for checklist",
          domain: "onboarding",
          status: "open",
        }),
      });
      setChecked((prev) => ({ ...prev, claim: true }));
      setSeeded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress — org, claim, attest, compare, honesty."
    >
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-[family-name:var(--font-display)] text-lg">
            Progress {doneCount} / {ITEMS.length}
          </p>
          <p className="text-sm text-slate-500">{pct}% complete</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-slate-200">
          <div
            className="score-bar h-full bg-[var(--studio-teal)] transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {ITEMS.map((item) => (
          <li
            key={item.key}
            className="flex flex-wrap items-start gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={checked[item.key]}
              onChange={() => toggle(item.key)}
              aria-label={item.label}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900">{item.label}</p>
              <p className="text-sm text-slate-500">{item.hint}</p>
              <Link
                href={item.href}
                className="mt-1 inline-block text-sm text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
              >
                Open {item.href}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={seedFirstClaim}>
          {seeded ? "Claim seeded" : "Seed first claim"}
        </Button>
        <Button asChild variant="secondary">
          <Link href="/demo">Open guided demo</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/pricing">View pricing</Link>
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </StudioShell>
  );
}
