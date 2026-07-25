"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open molecule packs",
    detail: "Review the seed kinase binding pack.",
    href: "/molecules",
  },
  {
    title: "Configure kernels",
    detail: "Confirm quantum multi-kernel families and classical weights.",
    href: "/kernels",
  },
  {
    title: "Add target case",
    detail: "Add a binding case with a success condition.",
    href: "/targets",
  },
  {
    title: "Record QSAR run",
    detail: "Capture quantum multi-kernel soft-sim cues for the target.",
    href: "/runs",
  },
  {
    title: "Run demo compare",
    detail: "Score quantum multi-kernel vs classical and read the gap.",
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
      const [targets, kernels, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/targets"),
        api<{ items: { id: string }[] }>("/api/kernels"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const targetId = targets.items[0]?.id;
      const kernelId = kernels.items[0]?.id;
      const qsarRunId = runs.items[0]?.id;
      if (!targetId || !kernelId || !qsarRunId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          targetId,
          kernelId,
          qsarRunId,
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
                        Next
                      </Button>
                    ) : (
                      <Button disabled={done} onClick={() => runCompare()}>
                        Run compare
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Locked</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? (
        <p className="mt-4 text-sm text-[var(--studio-lime)]">{msg}</p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
