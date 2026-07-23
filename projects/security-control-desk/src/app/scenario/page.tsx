"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreControlFit } from "@/domain/controlFit";

export default function ScenarioPage() {
  const [peak, setPeak] = useState("1150");
  const [threshold, setThreshold] = useState("1000");
  const [candidates, setCandidates] = useState("30:10|-35:18|-50:20");
  const [cheat, setCheat] = useState(false);
  const result = scoreControlFit({
    base_peak: Number(peak) || 1100,
    threshold: Number(threshold) || 1000,
    candidates,
    open_loop_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--scd-muted)]">
          Naive open-loop baseline vs safer agentic counterfactual control —
          feasibility gate, physics injection, min-risk select.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="peak">Predicted peak (base_peak)</Label>
            <Input
              id="peak"
              value={peak}
              onChange={(e) => setPeak(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="threshold">Safety threshold θ</Label>
            <Input
              id="threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cands">Candidates (μ:δ|μ:δ)</Label>
            <Input
              id="cands"
              value={candidates}
              onChange={(e) => setCandidates(e.target.value)}
              placeholder="-20:10|-35:15"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            open-loop cheat (must reject)
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
                <p>naive open-loop risk: {result.naive.risk_score}</p>
                <p>safer agentic risk: {result.safer.risk_score}</p>
                <p>delta_score (risk reduced): {result.delta_score}</p>
                <p>
                  safer action: {result.safer.action}
                  {result.safer.selected_magnitude != null
                    ? ` (μ=${result.safer.selected_magnitude}, δ=${result.safer.selected_duration})`
                    : ""}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
