"use client";

import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a label pack",
    body: "Start from the seeded iminosulfur 18F soft-sim pack — version the labeling context first.",
    href: "/packs",
  },
  {
    title: "Check precursor + exchange",
    body: "Confirm precursor scaffold and late-stage isotopic swap floors before scoring.",
    href: "/precursors",
  },
  {
    title: "Run A/B compare",
    body: "Score fast isotopic exchange (A) against multistep prosthetic baseline (B).",
    href: "/compare",
    action: "compare",
  },
  {
    title: "Review scoreboard + honesty",
    body: "Rank the delta, then read the GMP / cyclotron / clinical dosing fence.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const current = STEPS[step];

  const runCompare = async () => {
    setBusy(true);
    try {
      const res = await api<{ compare: { winner: string; gap: number } }>(
        "/api/compare",
        {
          method: "POST",
          body: JSON.stringify({ name: "Guided demo compare" }),
        },
      );
      setNote(`Winner ${res.compare.winner} · gap ${res.compare.gap}`);
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Compare failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the core fluorine-18 labeling soft-sim path in four steps."
    >
      <ol className="mb-8 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={
              i === step
                ? "font-semibold text-[var(--fl-cobalt)]"
                : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]"
            }
          >
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>
      <div className="rounded-lg border bg-white p-6">
        <p className="text-sm uppercase tracking-wide text-[var(--fl-amber)]">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
          {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {current.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={current.href}>
            <Button type="button" variant="outline">
              Open surface
            </Button>
          </Link>
          {"action" in current && current.action === "compare" ? (
            <Button type="button" disabled={busy} onClick={() => void runCompare()}>
              {busy ? "Running…" : "Run /api/compare"}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={step >= STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next
          </Button>
        </div>
        {note ? <p className="mt-4 text-sm">{note}</p> : null}
      </div>
    </StudioShell>
  );
}

export default DemoPage;
