"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreSafetyFit } from "@/domain/safetyFit";

export default function ScenarioPage() {
  const [roles, setRoles] = useState("invariant,edge,node-class");
  const [intents, setIntents] = useState("invariant,edge,node-class");
  const [cheat, setCheat] = useState(false);
  const result = scoreSafetyFit({
    invariant_tags: roles,
    regression_tags: intents,
    checklist_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--asd-muted)]">
          Checklist baseline vs structural monitor safety scoring when
          invariant node tags align with regression signal.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="roles">Pedagogical role tags</Label>
            <Input
              id="roles"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="intents">Learner intent tags</Label>
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
            checklist cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--asd-teal)] hover:bg-[var(--asd-teal-deep)]"
          >
            Run compare
          </Button>
          <div className="std-reveal rounded-md border border-[var(--asd-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--asd-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>checklist baseline score: {result.naive.safety_score}</p>
                <p>structural monitor score: {result.integrated.safety_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
