"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open chemistry packs",
    detail: "Review the seed GRI-Mech soft-sim pack.",
    href: "/chemistry",
  },
  {
    title: "Import rate table",
    detail: "Confirm reaction counts and surrogate vs full-rate weights.",
    href: "/rates",
  },
  {
    title: "Configure surrogate",
    detail: "Add an entropy-constrained surrogate with a success condition.",
    href: "/surrogates",
  },
  {
    title: "Record kinetics run",
    detail: "Capture entropy soft-sim cues for the surrogate.",
    href: "/runs",
  },
  {
    title: "Run demo compare",
    detail: "Score entropy surrogate vs full-rate and read the gap.",
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
      const [surrogates, rates, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/surrogates"),
        api<{ items: { id: string }[] }>("/api/rates"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const surrogateId = surrogates.items[0]?.id;
      const rateTableId = rates.items[0]?.id;
      const kineticsRunId = runs.items[0]?.id;
      if (!surrogateId || !rateTableId || !kineticsRunId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          surrogateId,
          rateTableId,
          kineticsRunId,
          bias: "balanced",
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
                  <div className="font-medium text-[var(--studio-ink)]">
                    Step {i + 1}: {s.title}
                  </div>
                  <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    {s.detail}
                  </p>
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
                        Next
                      </Button>
                    ) : (
                      <Button disabled={done} onClick={() => runCompare()}>
                        Run compare
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_40%,transparent)]">
                    Locked
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? (
        <p className="mt-4 text-sm text-[var(--ks-teal)]">{msg}</p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
