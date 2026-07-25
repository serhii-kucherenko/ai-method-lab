"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type ChecklistKey =
  | "org"
  | "clip"
  | "character"
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
    key: "clip",
    label: "Create first clip",
    href: "/clips",
    hint: "Register a long-form episode clip.",
  },
  {
    key: "character",
    label: "Add a named character",
    href: "/characters",
    hint: "Bind cast to your clip.",
  },
  {
    key: "compare",
    label: "Run dual compare",
    href: "/compare",
    hint: "Compare track-aware vs fluency baseline.",
  },
  {
    key: "honesty",
    label: "Acknowledge honesty fence",
    href: "/honesty",
    hint: "Read soft-sim limits — models do not “watch” here.",
  },
];

const STORAGE_KEY = "vts-onboarding-v1";

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>({
    org: false,
    clip: false,
    character: false,
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

  async function seedFirstClip() {
    setError("");
    try {
      const clip = await api<{ id: string }>("/api/clips", {
        method: "POST",
        body: JSON.stringify({
          title: "Onboarding seed clip",
          showLabel: "Onboarding",
          status: "ready",
        }),
      });
      await api("/api/characters", {
        method: "POST",
        body: JSON.stringify({
          clipId: clip.id,
          name: "SeedChar",
          outfitChangeCount: 2,
        }),
      });
      setChecked((prev) => ({ ...prev, clip: true, character: true }));
      setSeeded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress — org, clip, character, compare, honesty."
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
            className="score-bar h-full bg-[var(--studio-coral)] transition-all"
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
                className="mt-1 inline-block text-sm text-[var(--studio-coral-deep)] underline-offset-2 hover:underline"
              >
                Open {item.href}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={seedFirstClip}>
          {seeded ? "Clip seeded" : "Seed first clip + character"}
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
