"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type ChecklistKey = "org" | "stream" | "segment" | "compare" | "honesty";

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
    key: "stream",
    label: "Create first sign stream",
    href: "/streams",
    hint: "Register a language-pair stream.",
  },
  {
    key: "segment",
    label: "Add a sentence segment + latency budget",
    href: "/sentences",
    hint: "Cut a gloss sentence and set a budget on Latency.",
  },
  {
    key: "compare",
    label: "Run dual compare",
    href: "/compare",
    hint: "Compare real-time stream vs offline-batch.",
  },
  {
    key: "honesty",
    label: "Acknowledge honesty fence",
    href: "/honesty",
    hint: "Read soft-sim limits — not live interpreter certification.",
  },
];

const STORAGE_KEY = "sss-onboarding-v1";

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>({
    org: false,
    stream: false,
    segment: false,
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

  async function seedFirstStream() {
    setError("");
    try {
      const stream = await api<{ id: string }>("/api/streams", {
        method: "POST",
        body: JSON.stringify({
          label: "Onboarding ASL feed",
          languagePair: "ASL→EN",
          status: "live",
        }),
      });
      await api("/api/sentences", {
        method: "POST",
        body: JSON.stringify({
          streamId: stream.id,
          glossText: "WELCOME",
          boundaryConfidence: 0.8,
          status: "active",
        }),
      });
      await api("/api/latency", {
        method: "POST",
        body: JSON.stringify({
          streamId: stream.id,
          budgetMs: 850,
          flushPolicy: "wait_boundary",
          status: "active",
        }),
      });
      setChecked((prev) => ({ ...prev, stream: true, segment: true }));
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
            className="score-bar h-full bg-[var(--studio-aqua)]"
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
        <Button onClick={seedFirstStream}>Seed demo stream</Button>
        {seeded ? (
          <span className="text-sm text-[var(--studio-lime)]">
            Seeded — mark compare and honesty when ready.
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </StudioShell>
  );
}
