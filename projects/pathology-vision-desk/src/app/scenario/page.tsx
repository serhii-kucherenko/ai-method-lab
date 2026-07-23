"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scorePathologyFit } from "@/domain/pathologyFit";

export default function ScenarioPage() {
  const [rare, setRare] = useState("vision,vision-language,slide");
  const [sample, setSample] = useState("vision,vision-language,slide");
  const [cheat, setCheat] = useState(false);
  const result = scorePathologyFit({
    expert_tags: rare,
    sample_feature_tags: sample,
    single_view_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--pvd-muted)]">
          single-view baseline vs multi-expert pathology scoring when expert tags
          align with sample features.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rare">Expert module tags</Label>
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
            Single-view cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--pvd-rose)] hover:bg-[var(--pvd-rose-deep)]"
            onClick={() => setRare((v) => v)}
          >
            Run compare
          </Button>
          <div className="pvd-reveal rounded-md border border-[var(--pvd-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--pvd-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>single-view baseline score: {result.naive.pathology_score}</p>
                <p>multi-expert score: {result.integrated.pathology_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
