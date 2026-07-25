"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a translate pack",
    body: "Versioned packs hold cohort targets and input budgets.",
    href: "/translates",
  },
  {
    title: "Register T1W/T2W inputs",
    body: "Make series fidelity spans explicit.",
    href: "/inputs",
  },
  {
    title: "Configure R2maps",
    body: "Ask whether GAN translation beats conventional R2.",
    href: "/maps",
  },
  {
    title: "Run soft-sim fidelities",
    body: "Capture T1W/T2W fidelity, GAN stability, and map coherence.",
    href: "/runs",
  },
  {
    title: "Compare A vs B",
    body: "gan_r2map_translation vs conventional_r2_baseline.",
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
      const [maps, inputs, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/maps"),
        api<{ items: { id: string }[] }>("/api/inputs"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          ganTranslation: { overall: number };
          conventionalBaseline: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo GAN vs conventional R2",
          mapId: maps.items[0]?.id,
          inputId: inputs.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.ganTranslation.overall} · B ${compare.compare.conventionalBaseline.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Demo"
      subtitle="Numbered walkthrough of the R2map translate soft-sim happy path."
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
        <Link href={current.href} className="text-[var(--r2-teal)] underline">
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
