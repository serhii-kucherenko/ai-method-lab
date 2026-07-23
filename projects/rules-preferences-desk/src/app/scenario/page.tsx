"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scorePackFit } from "@/domain/packFit";

const DEFAULT_ITEMS =
  "passport:1:10|phone:1:9|charger:1:8:Dphone|camera:3:7:Dcharger|liquids:2:6:B|coat:4:5|book:2:4|socks:1:3";

export default function ScenarioPage() {
  const [capacity, setCapacity] = useState("8");
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [cheat, setCheat] = useState(false);
  const result = scorePackFit({
    capacity: Number(capacity) || 8,
    items,
    preference_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--scd-muted)]">
          Naive preference-only baseline vs hard-rule gated preference selection —
          capacity, bans, and dependencies must hold.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="capacity">Luggage capacity</Label>
            <Input
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="items">Items (id:weight:utility[:B][:Ddep]|…)</Label>
            <Input
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="passport:1:10|liquids:2:6:B"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cheat}
              onChange={(e) => setCheat(e.target.checked)}
            />
            preference-only cheat (must reject)
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
                  naive preference-only: utility {result.naive.utility}, violations{" "}
                  {result.naive.violations}, risk {result.naive.risk_score}
                </p>
                <p>
                  hard-rule gated: utility {result.constrained.utility}, violations{" "}
                  {result.constrained.violations}, risk{" "}
                  {result.constrained.risk_score}
                </p>
                <p>delta_score (risk reduced): {result.delta_score}</p>
                <p>
                  constrained action: {result.constrained.action} — selected{" "}
                  {result.constrained.selected.join(", ") || "(none)"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
