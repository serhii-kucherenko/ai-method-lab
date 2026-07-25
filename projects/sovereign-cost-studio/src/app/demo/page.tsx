"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a cost pack",
    body: "Versioned packs hold infra targets and model budgets.",
    href: "/costs",
  },
  {
    title: "Configure a W/E/E model",
    body: "Make water, energy, emissions, and cooling factors explicit.",
    href: "/models",
  },
  {
    title: "Define an infra scenario",
    body: "Ask whether sovereign accounting beats naive cloud footprints.",
    href: "/scenarios",
  },
  {
    title: "Run soft-sim intensities",
    body: "Capture water, energy, emissions clarity, and stability.",
    href: "/runs",
  },
  {
    title: "Compare A vs B",
    body: "sovereign_infra_wee_accounting vs naive_cloud_footprint_baseline.",
    href: "/compare",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runSeedCompare() {
    setError("");
    setResult("");
    try {
      const [scenarios, models, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/scenarios"),
        api<{ items: { id: string }[] }>("/api/models"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          sovereignWee: { overall: number };
          naiveCloud: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo sovereign vs cloud",
          scenarioId: scenarios.items[0]?.id,
          modelId: models.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.sovereignWee.overall} · B ${compare.compare.naiveCloud.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Demo"
      subtitle="Numbered walkthrough of the sovereign cost soft-sim happy path."
    >
      <ol className="mb-6 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={
              i === step
                ? "rounded-md bg-[var(--studio-accent-soft)] px-3 py-2"
                : "px-3 py-2"
            }
          >
            <span className="font-medium">
              {i + 1}. {s.title}
            </span>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
      <p className="mb-4 text-sm">
        Current step:{" "}
        <Link href={current.href} className="text-[var(--sc-teal)] underline">
          {current.href}
        </Link>
      </p>
      <div className="flex flex-wrap gap-2">
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
          Next step
        </Button>
        <Button variant="outline" onClick={runSeedCompare}>
          Run seed compare
        </Button>
      </div>
      {result ? <p className="mt-4 text-sm">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
