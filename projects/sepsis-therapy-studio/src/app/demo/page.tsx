"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a therapy pack",
    body: "Start from the seeded early empiric sepsis soft-sim pack on /therapies.",
    href: "/therapies",
  },
  {
    title: "Review regimens",
    body: "Confirm antibiotic regimens cover the early sepsis cases you care about.",
    href: "/regimens",
  },
  {
    title: "Check onsets",
    body: "Onset windows define lock conditions for soft-sim honesty.",
    href: "/onsets",
  },
  {
    title: "Run A/B compare",
    body: "Compare continuous-time HMM therapy effectiveness against the static guideline baseline.",
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
      const [onsets, regimens, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/onsets"),
        api<{ items: { id: string }[] }>("/api/regimens"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          ctHmm: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo CT-HMM vs static guideline",
          onsetId: onsets.items[0]?.id,
          regimenId: regimens.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · CT-HMM ${compare.compare.ctHmm.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the sepsis therapy soft-sim happy path."
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
          <Link href={current.href} className="underline text-[var(--st-teal)]">
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
