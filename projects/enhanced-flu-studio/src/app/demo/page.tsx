"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  "Open the seeded Nordic EIV program pack",
  "Review the Sweden country scenario",
  "Confirm the expanded EIV 65+ program spec",
  "Inspect the hospitalizations outcome run",
  "Run expanded EIV vs current policy compare",
];

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const row = await api<{
        winner: string;
        gap: number;
        expanded: { overall: number };
        baseline: { overall: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo Nordic EIV vs policy",
          packId: "pack-demo",
          countryId: "country-demo",
          programId: "program-demo",
          outcomeId: "outcome-demo",
        }),
      });
      setResult(
        `Winner ${row.winner} · gap ${row.gap} · expanded ${row.expanded.overall} · baseline ${row.baseline.overall}`,
      );
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the core happy path — create context, score outcomes, dual-compare."
    >
      <ol className="mb-6 space-y-3">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`rounded-lg border px-4 py-3 ${i === step ? "border-[var(--ef-teal)] bg-white" : "bg-white/70"}`}
          >
            <span className="mr-2 font-[family-name:var(--font-display)] text-[var(--ef-teal)]">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          Next step
        </Button>
        <Button type="button" onClick={() => void runCompare()}>
          Run demo compare
        </Button>
        <Button asChild variant="outline">
          <Link href="/packs">Open packs</Link>
        </Button>
      </div>
      {result ? <p className="mt-4 text-sm text-[var(--ef-teal)]">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
