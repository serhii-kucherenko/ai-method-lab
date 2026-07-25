"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { DEV_TOKEN } from "@/claim";

const STEPS = [
  "Open prompts and confirm the seed pack",
  "Review high-risk psychiatric scenario suites",
  "Confirm structured therapy-safety gates",
  "Capture a soft-sim run",
  "Run structured gates vs prompt-only compare",
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setResult("");
    setError("");
  }, [step]);

  async function runCompare() {
    setError("");
    try {
      const headers = { authorization: `Bearer ${DEV_TOKEN}` };
      const [gates, scenarios, runs] = await Promise.all([
        fetch("/api/gates", { headers }).then((r) => r.json()),
        fetch("/api/scenarios", { headers }).then((r) => r.json()),
        fetch("/api/runs", { headers }).then((r) => r.json()),
      ]);
      const body = {
        name: "Demo gates vs prompt-only",
        gateId: gates.items[0]?.id,
        scenarioId: scenarios.items[0]?.id,
        runId: runs.items[0]?.id,
      };
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${DEV_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "compare failed");
      setResult(
        `Winner ${data.compare.winner} · gap ${data.compare.gap} · gates ${data.compare.gates.overall} vs prompt-only ${data.compare.promptOnly.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided soft-sim walkthrough of the core therapy-prompt happy path."
    >
      <ol className="mb-6 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={
              i === step
                ? "font-semibold text-[var(--tp-teal)]"
                : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]"
            }
          >
            {i + 1}. {s}
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
          disabled={step >= STEPS.length - 1}
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          Next step
        </Button>
        {step === STEPS.length - 1 ? (
          <Button onClick={runCompare}>Run /api/compare</Button>
        ) : null}
      </div>
      {result ? <p className="mt-4 text-sm">{result}</p> : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--tp-amber)]">{error}</p>
      ) : null}
      <p className="mt-8 text-sm">
        <Link href="/flows" className="text-[var(--tp-teal)] underline">
          See all flows
        </Link>
      </p>
    </StudioShell>
  );
}

export default DemoPage;
