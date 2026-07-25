"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a campaign pack",
    body: "Start from the seed kinase soft-sim campaign pack or create your own.",
    href: "/campaigns",
  },
  {
    title: "Review property targets",
    body: "Confirm MW, cLogP windows, and efficiency vs baseline weights.",
    href: "/targets",
  },
  {
    title: "Confirm the optimizer",
    body: "Check the optimizer channel and success condition.",
    href: "/optimizers",
  },
  {
    title: "Run dual A/B compare",
    body: "Score sample-efficient optimization against the naive generative baseline.",
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
      const [optimizers, targets, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/optimizers"),
        api<{ items: { id: string }[] }>("/api/targets"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          sampleEfficient: { overall: number };
          naiveGenerativeBaseline: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo sample-efficient vs naive",
          optimizerId: optimizers.items[0]?.id,
          targetId: targets.items[0]?.id,
          runId: runs.items[0]?.id,
          bias: "balanced",
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.sampleEfficient.overall} vs B ${compare.compare.naiveGenerativeBaseline.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Four steps from campaign pack to dual compare."
    >
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-sm text-[var(--ms-teal)]">
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
          <p className="mt-4 text-sm text-[var(--ms-teal)]">{error}</p>
        ) : null}
      </div>
    </StudioShell>
  );
}
