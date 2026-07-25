"use client";

import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a panel pack",
    body: "Start from a versioned soft-sim panel pack — not an opaque pathogenicity dump.",
  },
  {
    title: "Configure an interpretable probe",
    body: "Set kind, embedding axis, and interpret layer.",
  },
  {
    title: "Link a biological mechanism",
    body: "Success conditions and pathway channels stay honesty-fenced when locked.",
  },
  {
    title: "Create a variant run",
    body: "Record panel coverage, probe fidelity, mechanism clarity, and stability.",
  },
  {
    title: "Run A/B compare",
    body: "Interpretable genomic FM probe versus opaque pathogenicity baseline.",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [mechanisms, probes, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/mechanisms"),
        api<{ items: { id: string }[] }>("/api/probes"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          interpretableFmProbe: { overall: number };
          opaquePathogenicity: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo interpretable vs opaque",
          mechanismId: mechanisms.items[0]?.id,
          probeId: probes.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.interpretableFmProbe.overall} · B ${compare.compare.opaquePathogenicity.overall}`,
      );
      setStep(STEPS.length - 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from panel pack to dual compare."
    >
      <ol className="mb-6 space-y-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`rounded-lg border px-4 py-3 ${
              i === step
                ? "border-[var(--vp-teal)] bg-[var(--studio-accent-soft)]"
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
          Next
        </Button>
        <Button onClick={runCompare}>Run live compare</Button>
      </div>
      {result ? (
        <p className="mt-4 text-sm text-[var(--vp-teal)]">{result}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
