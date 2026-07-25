"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a deck pack",
    body: "Start from the seed ELISA soft-sim deck pack or create your own.",
    href: "/decks",
  },
  {
    title: "Review assay rules",
    body: "Confirm volume, dwell, and assay vs runner weights.",
    href: "/assays",
  },
  {
    title: "Confirm the monitor",
    body: "Check the monitor channel and success condition.",
    href: "/monitors",
  },
  {
    title: "Run dual A/B compare",
    body: "Score assay-aware validation against the naive protocol runner.",
    href: "/compare",
  },
];

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [monitors, assays, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/monitors"),
        api<{ items: { id: string }[] }>("/api/assays"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          assayAware: { overall: number };
          naiveProtocolRunner: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo assay-aware vs naive",
          monitorId: monitors.items[0]?.id,
          assayId: assays.items[0]?.id,
          runId: runs.items[0]?.id,
          bias: "balanced",
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.assayAware.overall} vs B ${compare.compare.naiveProtocolRunner.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Four steps from deck pack to dual compare."
    >
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-sm text-[var(--ag-aqua)]">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
          {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          {current.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={current.href}>Open surface</Link>
          </Button>
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button
            disabled={step >= STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next
          </Button>
          {step === STEPS.length - 1 ? (
            <Button onClick={runCompare}>Run /api/compare</Button>
          ) : null}
        </div>
        {result ? <p className="mt-4 text-sm">{result}</p> : null}
        {error ? (
          <p className="mt-4 text-sm text-[var(--ag-amber)]">{error}</p>
        ) : null}
      </div>
    </StudioShell>
  );
}
