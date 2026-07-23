"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreBombFit } from "@/domain/bombFit";

export default function ScenarioPage() {
  const [triggers, setTriggers] = useState("comparison,adaptive,opaque");
  const [payloads, setPayloads] = useState("actuator");
  const [cheat, setCheat] = useState(false);
  const result = scoreBombFit({
    trigger_kinds: triggers,
    payload_kinds: payloads,
    naive_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--lld-muted)]">
          Naive scan baseline vs formal trigger synthesis when trigger kinds and
          payload classes are present.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="triggers">Trigger kinds</Label>
            <Input
              id="triggers"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payloads">Payload kinds</Label>
            <Input
              id="payloads"
              value={payloads}
              onChange={(e) => setPayloads(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            naive-scan cheat (must reject)
          </label>
          <Button
            type="button"
            className="w-fit bg-[var(--lld-teal)] hover:bg-[var(--lld-teal-deep)]"
          >
            Run compare
          </Button>
          <div className="std-reveal rounded-md border border-[var(--lld-line)] bg-white/80 p-4 font-mono text-sm">
            {result.status === "reject" ? (
              <p className="text-[var(--lld-signal)]">Reject: {result.reason}</p>
            ) : (
              <div className="space-y-1">
                <p>naive scan baseline score: {result.naive.bomb_score}</p>
                <p>formal trigger synthesis score: {result.formal.bomb_score}</p>
                <p>delta_score: {result.delta_score}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
