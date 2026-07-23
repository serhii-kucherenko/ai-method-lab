"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scorePromptCache } from "@/domain/promptCache";

export default function ScenarioPage() {
  const [prefixTokens, setPrefixTokens] = useState("12000");
  const [ratio, setRatio] = useState("3");
  const [queries, setQueries] = useState("10");
  const [cheat, setCheat] = useState(false);
  const result = scorePromptCache({
    prefix_tokens: Number(prefixTokens) || 12000,
    ratio: Number(ratio) || 3,
    queries: Number(queries) || 10,
    ideal_rho_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--scd-muted)]">
          Naive query-aware baseline vs cache-aware compression under a two-tier
          hit-rate cost model (~3500 token threshold).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="prefix_tokens">Prefix tokens</Label>
              <Input
                id="prefix_tokens"
                value={prefixTokens}
                onChange={(e) => setPrefixTokens(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ratio">Compression ratio</Label>
              <Input
                id="ratio"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="queries">Queries (N)</Label>
              <Input
                id="queries"
                value={queries}
                onChange={(e) => setQueries(e.target.value)}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            Ideal ρ=1.0 cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--scd-steel)] hover:bg-[var(--scd-steel-deep)]"
          >
            Run compare
          </Button>
          <div className="std-reveal rounded-md border border-[var(--scd-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--scd-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>
                  vanilla: cost {result.vanilla.cost}, risk{" "}
                  {result.vanilla.risk_score}
                </p>
                <p>
                  cache-only: cost {result.cache_only.cost}, tier{" "}
                  {result.cache_only.tier}, ρ {result.cache_only.rho}
                </p>
                <p>
                  query-aware (naive): cost {result.naive.cost}, risk{" "}
                  {result.naive.risk_score}
                </p>
                <p>
                  cache-aware: cost {result.pla.cost}, ratio_used{" "}
                  {result.pla.ratio_used}/{result.ratio} (r_max {result.r_max}),
                  tier {result.pla.tier}, risk {result.pla.risk_score}
                </p>
                <p>delta_score (vs query-aware): {result.delta_score}</p>
                <p>vs_best_naive: {result.vs_best_naive}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
