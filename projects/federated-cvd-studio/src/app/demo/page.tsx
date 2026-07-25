"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open cohort packs",
    detail: "Review the seed multi-site CVD soft-sim pack.",
    href: "/cohorts",
  },
  {
    title: "Define feature schema",
    detail: "Confirm CVD features and federation vs central weights.",
    href: "/features",
  },
  {
    title: "Configure federation",
    detail: "Add a hospital federation ring with a success condition.",
    href: "/federation",
  },
  {
    title: "Record CVD run",
    detail: "Capture soft-sim participation and agreement cues.",
    href: "/runs",
  },
  {
    title: "Run demo compare",
    detail: "Score federated vs centralized and read the gap.",
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
      const [federations, schemas, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/federation"),
        api<{ items: { id: string }[] }>("/api/features?kind=schemas"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const federationId = federations.items[0]?.id;
      const schemaId = schemas.items[0]?.id;
      const runId = runs.items[0]?.id;
      if (!federationId || !schemaId || !runId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          federationId,
          schemaId,
          runId,
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
                      <Button onClick={() => setStep(i + 1)}>Next</Button>
                    ) : (
                      <Button onClick={() => runCompare()}>
                        Run compare
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
                    Locked
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? (
        <p className="mt-6 text-sm text-[var(--studio-signal)]">{msg}</p>
      ) : null}
      {done ? (
        <p className="mt-2 text-sm">
          Demo compare complete — inspect{" "}
          <Link className="underline" href="/scoreboard">
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
