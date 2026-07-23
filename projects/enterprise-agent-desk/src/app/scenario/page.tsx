"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scorePlanFit } from "@/domain/planFit";

export default function ScenarioPage() {
  const [roles, setRoles] = useState("coordinator,sales,inventory");
  const [intents, setIntents] = useState("coordinator,sales,inventory");
  const [cheat, setCheat] = useState(false);
  const result = scorePlanFit({
    agent_roles: roles,
    workflow_tags: intents,
    single_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--ead-muted)]">
          Single-agent baseline vs multi-agent coordinator scoring when
          role-aligned agent tags align with workflow functions.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="roles">Agent role tags</Label>
            <Input
              id="roles"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="intents">Workflow function tags</Label>
            <Input
              id="intents"
              value={intents}
              onChange={(e) => setIntents(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            single-agent cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--ead-teal)] hover:bg-[var(--ead-teal-deep)]"
          >
            Run compare
          </Button>
          <div className="std-reveal rounded-md border border-[var(--ead-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--ead-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>single-agent baseline score: {result.naive.plan_score}</p>
                <p>multi-agent coordinator score: {result.integrated.plan_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
