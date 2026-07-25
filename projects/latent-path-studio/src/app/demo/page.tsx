"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a seeded cohort pack",
    body: "Latent Path ships a demo pack for adolescent multi-domain soft-sim.",
  },
  {
    title: "Confirm cohort and predictors",
    body: "Cohorts carry wave coverage; predictors span joint symptom domains.",
  },
  {
    title: "Run dual A/B compare",
    body: "Score multi_domain_latent_trajectory against single_domain_baseline.",
  },
  {
    title: "Read the delta",
    body: "Winner and gap land on the scoreboard before any soft-sim lock.",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      setError("");
      const payload = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Guided demo compare",
          outcomeId: "outcome-demo",
          cohortId: "cohort-demo",
          predictorId: "predictor-demo",
          trajectoryId: "trajectory-demo",
        }),
      });
      setResult(
        `Winner: ${payload.compare.winner} · gap ${payload.compare.gap}`,
      );
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the core happy path: pack → cohort/predictors → dual compare."
    >
      <ol className="space-y-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`rounded-lg border bg-white p-4 ${
              i === step ? "border-[var(--lp-teal)]" : ""
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-[var(--lp-teal)]">
              Step {i + 1}
            </p>
            <h2 className="mt-1 font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={step >= STEPS.length - 1}
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          Next
        </Button>
        <Button type="button" onClick={() => void runCompare()}>
          Run compare
        </Button>
        <Link href="/compare" className="self-center text-sm underline">
          Open compare
        </Link>
      </div>
      {result ? <p className="mt-4 text-[var(--lp-teal)]">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
