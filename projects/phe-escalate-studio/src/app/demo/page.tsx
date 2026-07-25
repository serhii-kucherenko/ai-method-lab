"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open an escalate pack",
    body: "Versioned packs hold escalate focus and case budgets.",
    href: "/escalates",
  },
  {
    title: "Configure a classification rule",
    body: "Make case velocity, geo cluster, and lab confirm channels explicit.",
    href: "/classifications",
  },
  {
    title: "Set escalation thresholds",
    body: "Threshold specs and lock success conditions.",
    href: "/thresholds",
  },
  {
    title: "Run soft-sim scores",
    body: "Capture signal clarity, case velocity, geo spread, lab confirm.",
    href: "/runs",
  },
  {
    title: "Compare A vs B",
    body: "ai_assisted_phe_escalation vs manual_triage_baseline.",
    href: "/compare",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runSeedCompare() {
    setError("");
    setResult("");
    try {
      const [thresholds, classifications, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/thresholds"),
        api<{ items: { id: string }[] }>("/api/classifications"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          aiAssisted: { overall: number };
          manualTriage: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo AI-assisted vs manual triage",
          thresholdId: thresholds.items[0]?.id,
          classificationId: classifications.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · A ${compare.compare.aiAssisted.overall} · B ${compare.compare.manualTriage.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Demo"
      subtitle="Numbered walkthrough of the PHE escalate soft-sim happy path."
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
        <Link href={current.href} className="text-[var(--pe-teal)] underline">
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

export default DemoPage;
