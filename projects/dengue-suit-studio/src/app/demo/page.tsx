"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  "Open the seeded risk pack",
  "Review the CMIP6 SSP5-8.5 scenario",
  "Confirm Aedes aegypti niche + urban overlay",
  "Run CMIP6 vs historical compare",
  "Check scoreboard + honesty fence",
];

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const [packs, scenarios, species, populations] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/packs"),
        api<{ items: { id: string }[] }>("/api/scenarios"),
        api<{ items: { id: string }[] }>("/api/species"),
        api<{ items: { id: string }[] }>("/api/populations"),
      ]);
      const packId = packs.items[0]?.id;
      const scenarioId = scenarios.items[0]?.id;
      const speciesId = species.items[0]?.id;
      const populationId = populations.items[0]?.id;
      if (!packId || !scenarioId || !speciesId || !populationId) {
        throw new Error("Seed data missing");
      }
      const res = await api<{
        compare: { winner: string; gap: number; cmip6: { overall: number }; historical: { overall: number } };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Guided demo compare",
          packId,
          scenarioId,
          speciesId,
          populationId,
          climateBias: "balanced",
        }),
      });
      setResult(
        `Winner ${res.compare.winner} · gap ${res.compare.gap} · CMIP6 ${res.compare.cmip6.overall} vs hist ${res.compare.historical.overall}`,
      );
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the core dengue thermal-suitability happy path in five steps."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ol className="mb-8 space-y-3">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-lg border px-4 py-3 ${i === step ? "border-[var(--ds-teal)] bg-white" : "bg-white/70"}`}
          >
            <span className="text-sm text-[var(--ds-teal)]">Step {i + 1}</span>
            <p className="font-medium">{label}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
          Next
        </Button>
        <Button type="button" onClick={() => void runCompare()}>
          Run demo compare
        </Button>
        <Link href="/compare" className="inline-flex items-center text-sm underline text-[var(--ds-teal)]">
          Open compare
        </Link>
      </div>
      {result ? <p className="mt-6 text-sm text-[var(--ds-teal)]">{result}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
