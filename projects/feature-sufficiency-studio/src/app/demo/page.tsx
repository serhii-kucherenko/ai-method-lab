"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open feature packs",
    detail: "Review the seed cardiometabolic feature pack.",
    href: "/features",
  },
  {
    title: "Review observation masks",
    detail: "Confirm a labs-only mask (or create one).",
    href: "/masks",
  },
  {
    title: "Add a cohort case",
    detail: "See a case with gold outcome on the cohorts workspace.",
    href: "/cohorts",
  },
  {
    title: "Create sufficiency run",
    detail: "Bind mask + cohort with coverage and salience metrics.",
    href: "/sufficiency",
  },
  {
    title: "Run demo compare",
    detail: "Score partial-observation vs full-feature and read the gap.",
    href: "/compare",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [cases, masks, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/cohorts"),
        api<{ items: { id: string }[] }>("/api/masks"),
        api<{ items: { id: string }[] }>("/api/sufficiency"),
      ]);
      const caseId = cases.items[0]?.id;
      const maskId = masks.items[0]?.id;
      const sufficiencyRunId = runs.items[0]?.id;
      if (!caseId || !maskId || !sufficiencyRunId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          caseId,
          maskId,
          sufficiencyRunId,
        }),
      });
      setMsg(`Winner ${data.compare.winner} · gap ${data.compare.gap}`);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Complete steps in order — later steps stay blocked until prior ones are marked done."
    >
      <ol className="space-y-4">
        {STEPS.map((s, i) => {
          const unlocked = i <= step;
          return (
            <li
              key={s.title}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">
                    Step {i + 1}: {s.title}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{s.detail}</p>
                </div>
                {unlocked ? (
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={s.href}>Open</Link>
                    </Button>
                    {i < STEPS.length - 1 ? (
                      <Button
                        disabled={step !== i}
                        onClick={() => setStep(i + 1)}
                      >
                        Next step
                      </Button>
                    ) : (
                      <Button disabled={step !== i} onClick={() => runCompare()}>
                        Run demo compare
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">
                    Step blocked until prior done
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? (
        <p className="mt-6 text-sm text-[var(--studio-teal)]">{msg}</p>
      ) : null}
      {done ? (
        <p className="mt-2 text-sm text-slate-600">
          Demo complete — inspect{" "}
          <Link href="/scoreboard" className="underline">
            scoreboard
          </Link>
          .
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
