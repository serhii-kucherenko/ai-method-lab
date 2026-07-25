"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a pv pack",
    body: "Start from the seeded atorvastatin initiation soft-sim pack on /signals.",
    href: "/signals",
  },
  {
    title: "Review cohorts",
    body: "Confirm defined-population cohorts cover the initiation cases you care about.",
    href: "/cohorts",
  },
  {
    title: "Check exposures",
    body: "Exposures define lock conditions for soft-sim honesty.",
    href: "/exposures",
  },
  {
    title: "Run A/B compare",
    body: "Compare target-trial causal signals against the spontaneous-reporting baseline.",
    href: "/compare",
  },
  {
    title: "Read the scoreboard",
    body: "Lock only when the delta and honesty fence are understood.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [exposures, cohorts, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/exposures"),
        api<{ items: { id: string }[] }>("/api/cohorts"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          targetTrial: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo target-trial vs spontaneous-reporting",
          exposureId: exposures.items[0]?.id,
          cohortId: cohorts.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · target-trial ${compare.compare.targetTrial.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the PV causal soft-sim happy path."
    >
      <ol className="mb-6 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={i === step ? "rounded-md bg-[var(--studio-accent-soft)] px-3 py-2" : "px-3 py-2"}
          >
            <span className="font-medium">{i + 1}. {s.title}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Step {step + 1}: {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={current.href} className="underline text-[var(--pc-teal)]">
            Open {current.href}
          </Link>
          {step === 3 ? <Button onClick={() => runCompare()}>Run demo compare</Button> : null}
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          <Button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
            Next
          </Button>
        </div>
        {result ? <p className="mt-4 text-sm">{result}</p> : null}
        {error ? <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      </div>
    </StudioShell>
  );
}

export default DemoPage;
