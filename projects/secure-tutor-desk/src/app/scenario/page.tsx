"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreTutorFit } from "@/domain/tutorFit";

export default function ScenarioPage() {
  const [roles, setRoles] = useState("socratic,practice,analogy");
  const [intents, setIntents] = useState("socratic,practice,analogy");
  const [cheat, setCheat] = useState(false);
  const result = scoreTutorFit({
    role_tags: roles,
    intent_tags: intents,
    single_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--std-muted)]">
          Single-model baseline vs multi-LLM orchestrated tutor scoring when
          pedagogical role tags align with learner intent.
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
            single-model cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--std-teal)] hover:bg-[var(--std-teal-deep)]"
          >
            Run compare
          </Button>
          <div className="std-reveal rounded-md border border-[var(--std-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--std-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>single-model baseline score: {result.naive.tutor_score}</p>
                <p>multi-LLM orchestrated score: {result.integrated.tutor_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
