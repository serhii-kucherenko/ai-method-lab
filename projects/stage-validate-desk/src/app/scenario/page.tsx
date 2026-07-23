"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  scoreGovernance,
  type GovernanceResult,
} from "@/domain/governance";

export default function ScenarioPage() {
  const [corpus, setCorpus] = useState("longctx");
  const [minN, setMinN] = useState("40");
  const [bias, setBias] = useState("1.2");
  const [cheat, setCheat] = useState(false);
  const [result, setResult] = useState<GovernanceResult | null>(null);

  function run() {
    setResult(
      scoreGovernance({
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
        <p className="mt-2 text-[var(--svd-muted)]">
          Naive intuition baselines (short-bench only / assume 4-bit faster /
          assume hand GEMM ceiling) versus a stage-gated plan with tiered
          long-context · bit-width · kernel measurements.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="corpus">Workload / profile</Label>
          <Input
            id="corpus"
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_n">Reference tolerance floor</Label>
          <Input
            id="min_n"
            value={minN}
            onChange={(e) => setMinN(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bias">Naive extremity</Label>
          <Input
            id="bias"
            value={bias}
            onChange={(e) => setBias(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--svd-muted)] self-end">
          <input
            type="checkbox"
            checked={cheat}
            onChange={(e) => setCheat(e.target.checked)}
          />
          Skip-gates cheat
        </label>
      </div>
      <Button
        type="button"
        onClick={run}
        className="bg-[var(--svd-steel)] hover:bg-[var(--svd-steel-deep)]"
      >
        Run compare
      </Button>
      {result && result.status === "ok" && (
        <div className="space-y-3" data-layers="live">
          <p className="text-sm text-[var(--svd-muted)]">
            Stage gate cells: passed {result.k_eligible} / {result.k_total};
            blocked {result.k_excluded}. Stage-gate{" "}
            {result.prefs.stage_gate.toFixed(2)} · long-context{" "}
            {result.prefs.long_context.toFixed(2)} · bit-measure{" "}
            {result.prefs.bit_measure.toFixed(2)}.
          </p>
          <div className="flex h-3 overflow-hidden rounded-sm bg-[var(--svd-mist)]">
            {Array.from({ length: Math.max(1, result.k_total) }).map((_, i) => (
              <span
                key={i}
                className="flex-1 border-r border-[var(--svd-paper)] last:border-0"
                style={{
                  background:
                    i < result.k_eligible
                      ? "var(--svd-steel)"
                      : "var(--svd-line)",
                  opacity: 0.55 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            data-export-scenario="live"
            onClick={() => {
              const blob = new Blob([JSON.stringify(result, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `stage-scenario-${result.corpus}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export scenario JSON
          </Button>
        </div>
      )}
      {result && (
        <pre className="overflow-x-auto rounded-md border border-[var(--svd-line)] bg-white/80 p-4 text-xs font-[family-name:var(--font-mono)]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
