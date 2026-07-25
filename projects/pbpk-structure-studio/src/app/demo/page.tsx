"use client";

import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a compound pack",
    body: "Start from a versioned soft-sim compound pack — not a SMILES dump.",
  },
  {
    title: "Compile a topology graph",
    body: "Set domain, organ count, and structure vs topology weight.",
  },
  {
    title: "Configure ADME models",
    body: "Success conditions and ADME channels stay structure-honest when locked.",
  },
  {
    title: "Create a PBPK run",
    body: "Record structure coverage, topology fidelity, ADME clarity, and stability.",
  },
  {
    title: "Run A/B compare",
    body: "Structure-only topology-compiled PBPK versus measured-lab baseline.",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [admes, topologies, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/adme"),
        api<{ items: { id: string }[] }>("/api/topologies"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          structureOnly: { overall: number };
          measuredLab: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo structure-only vs measured-lab",
          admeId: admes.items[0]?.id,
          topologyId: topologies.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.structureOnly.overall} · B ${compare.compare.measuredLab.overall}`,
      );
      setStep(STEPS.length - 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from compound pack to dual compare."
    >
      <ol className="mb-6 space-y-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`rounded-lg border px-4 py-3 ${
              i === step
                ? "border-[var(--pb-teal)] bg-[var(--studio-accent-soft)]"
                : "border-[var(--studio-line)] bg-[var(--studio-panel)]"
            }`}
          >
            <div className="font-medium">
              {i + 1}. {s.title}
            </div>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        <Button
          variant="outline"
          disabled={step >= STEPS.length - 1}
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          Next step
        </Button>
        <Button onClick={runCompare}>Run seed compare</Button>
      </div>
      {result ? (
        <p className="mt-4 text-sm text-[var(--pb-teal)]">{result}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
