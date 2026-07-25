"use client";

import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a clip pack",
    body: "Start from a versioned soft-sim clip pack — not a single-channel dump.",
  },
  {
    title: "Configure a multimodal sensor",
    body: "Set kind, channels, and channel count.",
  },
  {
    title: "Define a stress signal",
    body: "Success conditions and stress channels stay honesty-fenced when locked.",
  },
  {
    title: "Create a clip run",
    body: "Record clip coverage, multimodal fidelity, sensor clarity, and stability.",
  },
  {
    title: "Run A/B compare",
    body: "Multimodal wearable stress sensing versus single-sensor baseline.",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [stresses, sensors, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/stress"),
        api<{ items: { id: string }[] }>("/api/sensors"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          multimodal: { overall: number };
          singleBaseline: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo multimodal vs single-sensor",
          stressId: stresses.items[0]?.id,
          sensorId: sensors.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.multimodal.overall} · B ${compare.compare.singleBaseline.overall}`,
      );
      setStep(STEPS.length - 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from clip pack to dual compare."
    >
      <ol className="mb-6 space-y-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`rounded-lg border px-4 py-3 ${
              i === step
                ? "border-[var(--fc-sap)] bg-[var(--studio-accent-soft)]"
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
        <p className="mt-4 text-sm text-[var(--fc-sap)]">{result}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
