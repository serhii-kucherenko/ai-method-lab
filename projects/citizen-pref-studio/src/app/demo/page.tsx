"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  { title: "Open a policy pack", body: "Start from the seed Safety-First Public Oversight pack.", href: "/packs" },
  { title: "Review options & countries", body: "Public oversight option + seven-country cohort.", href: "/options" },
  { title: "Check survey + pref run", body: "Conjoint batch and soft-sim preference run.", href: "/prefs" },
  { title: "Run dual compare", body: "safety_first_public_oversight vs innovation_first_self_regulation.", href: "/compare" },
  { title: "Read honesty", body: "Confirm soft-sim fence before any lock story.", href: "/honesty" },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const res = await api<{ compare: { winner: string; gap: number } }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          packId: "pack-demo",
          optionId: "option-demo",
          countryId: "country-demo",
          surveyId: "survey-demo",
          prefRunId: "run-demo",
        }),
      });
      setResult(`Winner ${res.compare.winner} · gap ${res.compare.gap}`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  const current = STEPS[step];

  return (
    <StudioShell title="Guided demo" subtitle="Five numbered steps through citizen preference soft-sim.">
      <p className="mb-4 text-sm">Step {step + 1} of {STEPS.length}</p>
      <article className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{current.title}</h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <Link href={current.href} className="mt-3 inline-block text-sm underline text-[var(--cp-teal)]">Open {current.href}</Link>
      </article>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
        <Button type="button" disabled={step >= STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Next</Button>
        <Button type="button" onClick={() => void runCompare()}>Run /api/compare</Button>
      </div>
      {result ? <p className="mt-4 text-sm text-[var(--cp-teal)]">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
