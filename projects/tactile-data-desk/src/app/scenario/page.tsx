"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  scoreSynthesis,
  type SynthesisResult,
} from "@/domain/synthesis";

export default function ScenarioPage() {
  const [corpus, setCorpus] = useState("contaminated");
  const [minN, setMinN] = useState("40");
  const [bias, setBias] = useState("1.2");
  const [cheat, setCheat] = useState(false);
  const [result, setResult] = useState<SynthesisResult | null>(null);

  function run() {
    setResult(
      scoreSynthesis({
        corpus,
        min_n: Number(minN) || 40,
        bias_scale: Number(bias) || 1.2,
        skip_verify_cheat: cheat,
      }),
    );
  }

  return (
    <section data-scenario="live" className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-2 text-[var(--tdd-muted)]">
          Speech-only answers (skip tactile grounding) vs grounded select →
          confirm → ask agent → verify on chart. Soft layered RTD simulation.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="corpus">Chart preset</Label>
          <Input
            id="corpus"
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_n">Confirm floor (min address)</Label>
          <Input
            id="min_n"
            value={minN}
            onChange={(e) => setMinN(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bias">Speech drift</Label>
          <Input
            id="bias"
            value={bias}
            onChange={(e) => setBias(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--tdd-muted)] self-end">
          <input
            type="checkbox"
            checked={cheat}
            onChange={(e) => setCheat(e.target.checked)}
          />
          Skip-verify cheat
        </label>
      </div>
      <Button
        type="button"
        onClick={run}
        className="bg-[var(--tdd-steel)] hover:bg-[var(--tdd-steel-deep)]"
      >
        Run compare
      </Button>
      {result && (
        <pre className="overflow-x-auto rounded-md border border-[var(--tdd-line)] bg-white/80 p-4 text-xs font-[family-name:var(--font-mono)]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
