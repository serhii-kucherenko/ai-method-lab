"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreWorldFit } from "@/domain/worldFit";

export default function ScenarioPage() {
  const [ops, setOps] = useState("preview,train,evaluate");
  const [planSteps, setPlanSteps] = useState("3");
  const [cheat, setCheat] = useState(false);
  const useOps = ops.trim().length > 0;
  const result = scoreWorldFit({
    ...(useOps
      ? { op_kinds: ops }
      : { plan_steps: Number(planSteps) || 1 }),
    step_burn_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--dsd-muted)]">
          Naive step-burn baseline vs world-model guided routing when operation
          kinds are present.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ops">Operation kinds</Label>
            <Input
              id="ops"
              value={ops}
              onChange={(e) => setOps(e.target.value)}
              placeholder="preview,inspect,train,evaluate"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plan">Plan steps (when ops empty)</Label>
            <Input
              id="plan"
              value={planSteps}
              onChange={(e) => setPlanSteps(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            naive-step-burn cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--dsd-teal)] hover:bg-[var(--dsd-teal-deep)]"
          >
            Run compare
          </Button>
          <div className="std-reveal rounded-md border border-[var(--dsd-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--dsd-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>naive step-burn baseline cost: {result.naive.cost_score}</p>
                <p>world-model guided cost: {result.world.cost_score}</p>
                <p>delta_score (savings): {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
