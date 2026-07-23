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
  const [corpus, setCorpus] = useState("adni");
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
        <p className="mt-2 text-[var(--hsd-muted)]">
          Naive baselines (segmentation-only, pheno_pixels high-confidence,
          single-center unchecked) versus an unified segmentation+phenotyping plan (native
          missingness · calibrated bands · center shift).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="corpus">Center / site</Label>
          <Input
            id="corpus"
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_n">Feature coverage floor</Label>
          <Input
            id="min_n"
            value={minN}
            onChange={(e) => setMinN(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bias">Seg-only extremity</Label>
          <Input
            id="bias"
            value={bias}
            onChange={(e) => setBias(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--hsd-muted)] self-end">
          <input
            type="checkbox"
            checked={cheat}
            onChange={(e) => setCheat(e.target.checked)}
          />
          Impute / pheno_pixels cheat
        </label>
      </div>
      <Button
        type="button"
        onClick={run}
        className="bg-[var(--hsd-steel)] hover:bg-[var(--hsd-steel-deep)]"
      >
        Run compare
      </Button>
      {result && result.status === "ok" && (
        <div className="space-y-3" data-layers="live">
          <p className="text-sm text-[var(--hsd-muted)]">
            Pathway cells: acquired {result.k_eligible} / {result.k_total};
            missing {result.k_excluded}. Native missingness{" "}
            {result.prefs.joint_structure.toFixed(2)} · calibrated{" "}
            {result.prefs.phenotype_link.toFixed(2)} · center shift{" "}
            {result.prefs.multicenter.toFixed(2)}.
          </p>
          <div className="flex h-3 overflow-hidden rounded-sm bg-[var(--hsd-mist)]">
            {Array.from({ length: Math.max(1, result.k_total) }).map((_, i) => (
              <span
                key={i}
                className="flex-1 border-r border-[var(--hsd-paper)] last:border-0"
                style={{
                  background:
                    i < result.k_eligible
                      ? "var(--hsd-steel)"
                      : "var(--hsd-line)",
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
              a.download = `heart-scan-scenario-${result.corpus}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export scenario JSON
          </Button>
        </div>
      )}
      {result && (
        <pre className="overflow-x-auto rounded-md border border-[var(--hsd-line)] bg-white/80 p-4 text-xs font-[family-name:var(--font-mono)]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
