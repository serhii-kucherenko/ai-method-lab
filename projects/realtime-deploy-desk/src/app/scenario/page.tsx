"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreDeployFit } from "@/domain/deployFit";

export default function ScenarioPage() {
  const [harness, setHarness] = useState("ir-lift,static-analysis,measure-gate");
  const [config, setConfig] = useState("ir-lift,static-analysis,measure-gate");
  const [cheat, setCheat] = useState(false);
  const result = scoreDeployFit({
    harness_tags: harness,
    config_feature_tags: config,
    manual_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--rdd-muted)]">
          Manual-tuning baseline vs harness-guided deploy scoring when harness
          tags align with config features.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="harness">Harness pass tags</Label>
            <Input
              id="harness"
              value={harness}
              onChange={(e) => setHarness(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="config">Config feature tags</Label>
            <Input
              id="config"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            manual-tuning cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--rdd-teal)] hover:bg-[var(--rdd-teal-deep)]"
          >
            Run compare
          </Button>
          <div className="rdd-reveal rounded-md border border-[var(--rdd-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--rdd-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>manual-tuning baseline score: {result.naive.deploy_score}</p>
                <p>harness-guided score: {result.integrated.deploy_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
