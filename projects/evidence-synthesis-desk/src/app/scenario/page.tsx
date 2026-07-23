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
        perfect_homogeneity_cheat: cheat,
      }),
    );
  }

  return (
    <section data-scenario="live" className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-2 text-[var(--esd-muted)]">
          Naive average of reported numbers (skip screening) vs screened
          eligibility → Hedges&apos; g → random-effects pooling with
          heterogeneity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="corpus">Corpus</Label>
          <Input
            id="corpus"
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_n">Min n (eligibility)</Label>
          <Input
            id="min_n"
            value={minN}
            onChange={(e) => setMinN(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bias">Bias scale</Label>
          <Input
            id="bias"
            value={bias}
            onChange={(e) => setBias(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--esd-muted)] self-end">
          <input
            type="checkbox"
            checked={cheat}
            onChange={(e) => setCheat(e.target.checked)}
          />
          Perfect homogeneity cheat
        </label>
      </div>
      <Button
        type="button"
        onClick={run}
        className="bg-[var(--esd-steel)] hover:bg-[var(--esd-steel-deep)]"
      >
        Run compare
      </Button>
      {result && result.status === "reject" && (
        <p className="text-[var(--esd-warn)]">Rejected: {result.reason}</p>
      )}
      {result && result.status === "ok" && (
        <div className="space-y-2 font-mono text-sm text-[var(--esd-ink)]">
          <p>
            Eligible {result.k_eligible}/{result.k_total} (excluded{" "}
            {result.k_excluded}), I² {result.i2}
          </p>
          <p>
            Naive average: effect {result.naive.effect}, risk{" "}
            {result.naive.risk_score}
          </p>
          <p>
            Fixed-effect-all: effect {result.include_all_fe.effect}, risk{" "}
            {result.include_all_fe.risk_score}
          </p>
          <p>
            Unweighted eligible: effect {result.unweighted_eligible.effect}, risk{" "}
            {result.unweighted_eligible.risk_score}
          </p>
          <p>
            Screened random-effects: μ {result.screened.effect}, risk{" "}
            {result.screened.risk_score}
          </p>
          <p>Delta (naive − screened): {result.delta_score}</p>
        </div>
      )}
    </section>
  );
}
