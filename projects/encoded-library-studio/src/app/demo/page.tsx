"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a library pack",
    body: "Start from the seeded Macrocyclic DELT Soft-Sim Pack — versioned context for soft-sim only.",
    href: "/packs",
  },
  {
    title: "Review libraries and cycles",
    body: "Confirm the DNA-encoded library scaffold and construct–screen cycle rounds.",
    href: "/libraries",
  },
  {
    title: "Check the hit shortlist",
    body: "Inspect precision floors before you score — not clinical candidate nomination.",
    href: "/hits",
  },
  {
    title: "Run A/B compare",
    body: "Score iterative DELT optimize against a single-pass library screen on the seeded assay.",
    href: "/compare",
    action: "compare",
  },
  {
    title: "Read the scoreboard",
    body: "See ranked deltas and keep honesty fences visible before any lock.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const current = STEPS[step];

  const runCompare = async () => {
    try {
      const res = await api<{ compare: { winner: string; gap: number } }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: "Guided demo compare" }),
      });
      setResult(`Winner ${res.compare.winner} · gap ${res.compare.gap}`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps a stranger can complete — soft-sim DELT compare path."
    >
      <ol className="mb-8 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`rounded-md px-3 py-2 ${i === step ? "bg-[var(--studio-accent-soft)]" : ""}`}
          >
            <span className="font-medium">
              {i + 1}. {s.title}
            </span>
          </li>
        ))}
      </ol>
      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Step {step + 1}: {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {current.body}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={current.href} className="underline text-[var(--el-sea)]">
            Open {current.href}
          </Link>
          {"action" in current && current.action === "compare" ? (
            <Button type="button" onClick={() => void runCompare()}>
              Run compare now
            </Button>
          ) : null}
        </div>
        {result ? <p className="mt-3 text-sm text-[var(--el-sea)]">{result}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-6 flex gap-2">
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
      </div>
    </StudioShell>
  );
}

export default DemoPage;
