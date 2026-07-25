"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open personae",
    detail: "Review the seed persona pack and anxious hedge-speaker.",
    href: "/personae",
  },
  {
    title: "Add a conversation",
    detail: "Confirm a case with gold urgency exists (or create one).",
    href: "/conversations",
  },
  {
    title: "Tune a style axis",
    detail: "See hedging vs direct poles on the styles workspace.",
    href: "/styles",
  },
  {
    title: "Create urgency run",
    detail: "Bind persona + case with style fit and diversity coverage.",
    href: "/urgency",
  },
  {
    title: "Run demo compare",
    detail: "Score style-aware vs idealized-patient and read the gap.",
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
      const [cases, personae, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/conversations"),
        api<{ items: { id: string }[] }>("/api/personae"),
        api<{ items: { id: string }[] }>("/api/urgency"),
      ]);
      const caseId = cases.items[0]?.id;
      const personaId = personae.items[0]?.id;
      const urgencyRunId = runs.items[0]?.id;
      if (!caseId || !personaId || !urgencyRunId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          caseId,
          personaId,
          urgencyRunId,
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
                  <span className="text-sm text-slate-400">Locked</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? <p className="mt-4 text-[var(--studio-mint)]">{msg}</p> : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-coral)]">{error}</p>
      ) : null}
      {done ? (
        <p className="mt-4 text-sm text-slate-600">
          Demo complete — continue on{" "}
          <Link className="underline" href="/scoreboard">
            scoreboard
          </Link>{" "}
          or{" "}
          <Link className="underline" href="/honesty">
            honesty
          </Link>
          .
        </p>
      ) : null}
    </StudioShell>
  );
}
