"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreRhythmFit } from "@/domain/rhythmFit";

export default function ScenarioPage() {
  const [rare, setRare] = useState("pvc,lbbb,rbbb");
  const [sample, setSample] = useState("pvc,lbbb,rbbb");
  const [cheat, setCheat] = useState(false);
  const result = scoreRhythmFit({
    rare_class_tags: rare,
    sample_feature_tags: sample,
    majority_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--hrd-muted)]">
          Majority baseline vs long-tail-aware rhythm scoring when rare classes
          align with sample features.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rare">Rare class tags</Label>
            <Input
              id="rare"
              value={rare}
              onChange={(e) => setRare(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sample">Sample feature tags</Label>
            <Input
              id="sample"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            Majority cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--hrd-teal)] hover:bg-[var(--hrd-teal-deep)]"
            onClick={() => setRare((v) => v)}
          >
            Run compare
          </Button>
          <div className="hrd-reveal rounded-md border border-[var(--hrd-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--hrd-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>majority baseline score: {result.naive.rhythm_score}</p>
                <p>long-tail-aware score: {result.integrated.rhythm_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
