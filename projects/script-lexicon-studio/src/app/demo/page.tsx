"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open language packs",
    detail: "Review the seed Ge'ez script pack.",
    href: "/languages",
  },
  {
    title: "Expand lexicon",
    detail: "Confirm expanded Ge'ez subword counts and expansion weights.",
    href: "/lexicons",
  },
  {
    title: "Configure tokenizer",
    detail: "Add a baseline multilingual tokenizer case with a success condition.",
    href: "/tokenizers",
  },
  {
    title: "Record eval run",
    detail: "Capture expanded-lexicon soft-sim cues for the tokenizer.",
    href: "/evals",
  },
  {
    title: "Run demo compare",
    detail: "Score expanded lexicon vs baseline and read the gap.",
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
      const [tokenizers, lexicons, evals] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/tokenizers"),
        api<{ items: { id: string }[] }>("/api/lexicons"),
        api<{ items: { id: string }[] }>("/api/evals"),
      ]);
      const tokenizerId = tokenizers.items[0]?.id;
      const lexiconId = lexicons.items[0]?.id;
      const evalRunId = evals.items[0]?.id;
      if (!tokenizerId || !lexiconId || !evalRunId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          tokenizerId,
          lexiconId,
          evalRunId,
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
                  <div className="font-medium text-stone-900">
                    Step {i + 1}: {s.title}
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{s.detail}</p>
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
                  <span className="text-sm text-stone-400">Locked</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? (
        <p className="mt-4 text-sm text-[var(--studio-teal)]">{msg}</p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
