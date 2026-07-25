"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a model pack",
    body: "Start from the seeded MASLD HLO soft-sim pack — version context before scoring.",
    href: "/packs",
  },
  {
    title: "Review lineage mix",
    body: "Confirm hepatocyte + stellate + cholangiocyte soft-sim floors on Lineages.",
    href: "/lineages",
  },
  {
    title: "Check MASLD phenotype",
    body: "Lipid and inflammation cues live under MASLD — soft-sim only.",
    href: "/masld",
  },
  {
    title: "Run A/B compare",
    body: "Score multicellular HLO (A) against single-lineage HLC baseline (B).",
    href: "/compare",
  },
  {
    title: "Read the scoreboard",
    body: "Rank soft-sim winners and export when deltas make sense.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const res = await api<{
        compare: { winner: string; gap: number; hlo: { overall: number }; hlc: { overall: number } };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: "Guided demo compare" }),
      });
      setResult(
        `Winner ${res.compare.winner} · gap ${res.compare.gap} · HLO ${res.compare.hlo.overall} / HLC ${res.compare.hlc.overall}`,
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  const current = STEPS[step];

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the core happy path: pack → lineage → MASLD → HLO vs HLC compare."
    >
      <ol className="mb-6 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={
              i === step
                ? "font-semibold text-[var(--lo-teal)]"
                : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]"
            }
          >
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>
      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Step {step + 1}: {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {current.body}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={current.href}>
            <Button type="button" variant="outline">
              Open {current.href}
            </Button>
          </Link>
          {step === 3 ? (
            <Button type="button" onClick={() => void runCompare()}>
              Run compare now
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
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
        {result ? <p className="mt-4 text-sm">{result}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      </div>
    </StudioShell>
  );
}

export default DemoPage;
