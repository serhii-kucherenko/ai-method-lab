"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Open colearns and confirm the seed pack",
  "Review disease activity labels",
  "Confirm a human reviewer",
  "Capture a soft-sim run",
  "Run human–AI vs AI-only compare",
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
      const [reviewers, labels, runs] = await Promise.all([
        fetch("/api/reviewers", {
          headers: { authorization: "Bearer share-colearn-dev-token" },
        }).then((r) => r.json()),
        fetch("/api/labels", {
          headers: { authorization: "Bearer share-colearn-dev-token" },
        }).then((r) => r.json()),
        fetch("/api/runs", {
          headers: { authorization: "Bearer share-colearn-dev-token" },
        }).then((r) => r.json()),
      ]);
      const body = {
        name: "Demo human–AI vs AI-only",
        reviewerId: reviewers.items[0]?.id,
        labelSetId: labels.items[0]?.id,
        runId: runs.items[0]?.id,
      };
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer share-colearn-dev-token",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "compare failed");
      setResult(
        `Winner ${data.compare.winner} · gap ${data.compare.gap} · human–AI ${data.compare.humanAi.overall} vs AI-only ${data.compare.aiOnly.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided soft-sim walkthrough of the core colearn happy path."
    >
      <ol className="mb-6 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={
              i === step
                ? "font-semibold text-[var(--sc-teal)]"
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
        <p className="mt-4 text-sm text-[var(--sc-amber)]">{error}</p>
      ) : null}
      <p className="mt-8 text-sm">
        <Link href="/flows" className="underline text-[var(--sc-teal)]">
          See all flows
        </Link>
      </p>
    </StudioShell>
  );
}

export default DemoPage;
