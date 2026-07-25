"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open an ecg pack",
    body: "Start from the seeded neonatal PPG–ECG soft-sim pack on /ecgs.",
    href: "/ecgs",
  },
  {
    title: "Review PPG channels",
    body: "Confirm dual-stream PPG configs cover the neonatal segment gaps you care about.",
    href: "/ppg",
  },
  {
    title: "Check inpaint recipes",
    body: "Inpaint recipes define lock conditions for soft-sim honesty.",
    href: "/inpaints",
  },
  {
    title: "Run A/B compare",
    body: "Compare alignment-free PPG-guided ECG against the alignment-dependent baseline.",
    href: "/compare",
  },
  {
    title: "Read the scoreboard",
    body: "Lock only when the delta and honesty fence are understood.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [inpaints, channels, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/inpaints"),
        api<{ items: { id: string }[] }>("/api/ppg"),
        api<{ items: { id: string }[] }>("/api/runs"),
      ]);
      const compare = await api<{
        compare: {
          winner: string;
          gap: number;
          alignmentFree: { overall: number };
        };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo alignment-free vs alignment-dependent",
          inpaintId: inpaints.items[0]?.id,
          ppgChannelId: channels.items[0]?.id,
          runId: runs.items[0]?.id,
        }),
      });
      setResult(
        `Winner ${compare.compare.winner} · gap ${compare.compare.gap} · alignment-free ${compare.compare.alignmentFree.overall}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step];

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the neonatal ECG soft-sim happy path."
    >
      <ol className="mb-6 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={i === step ? "rounded-md bg-[var(--studio-accent-soft)] px-3 py-2" : "px-3 py-2"}
          >
            <span className="font-medium">{i + 1}. {s.title}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Step {step + 1}: {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={current.href} className="underline text-[var(--ne-teal)]">
            Open {current.href}
          </Link>
          {step === 3 ? <Button onClick={() => runCompare()}>Run demo compare</Button> : null}
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          <Button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
            Next
          </Button>
        </div>
        {result ? <p className="mt-4 text-sm">{result}</p> : null}
        {error ? <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      </div>
    </StudioShell>
  );
}

export default DemoPage;
