"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scoreItinerary } from "@/domain/itineraryPlan";

const DEFAULT_POIS =
  "museum:10:17:2:9|cafe:8:20:1:7|park:9:18:2:8|shop:11:19:1:6|gallery:10:16:2:8|viewpoint:7:19:1:5";

export default function ScenarioPage() {
  const [dayBudget, setDayBudget] = useState("8");
  const [pois, setPois] = useState(DEFAULT_POIS);
  const [cheat, setCheat] = useState(false);
  const result = scoreItinerary({
    day_budget: Number(dayBudget) || 8,
    pois,
    preference_cheat: cheat || undefined,
  });

  return (
    <section data-scenario="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Scenario compare
        </h1>
        <p className="mt-1 text-[var(--scd-muted)]">
          Naive preference-only baseline vs feasibility-first plan/learn/adapt —
          opening hours, travel, and day budget must hold.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="day_budget">Day budget (hours)</Label>
            <Input
              id="day_budget"
              value={dayBudget}
              onChange={(e) => setDayBudget(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pois">
              POIs (id:open:close:duration:preference|…)
            </Label>
            <Input
              id="pois"
              value={pois}
              onChange={(e) => setPois(e.target.value)}
              placeholder="museum:10:17:2:9|cafe:8:20:1:7"
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
                  naive preference-only: preference {result.naive.preference},
                  violations {result.naive.violations}, risk{" "}
                  {result.naive.risk_score}
                </p>
                <p>
                  plan/learn/adapt: preference {result.pla.preference},
                  violations {result.pla.violations}, risk {result.pla.risk_score}
                </p>
                <p>delta_score (risk reduced): {result.delta_score}</p>
                <p>
                  pla action: {result.pla.action} — stops{" "}
                  {result.pla.stops.join(", ") || "(none)"} (candidates{" "}
                  {result.pla.candidates}
                  {result.pla.adapted ? ", adapted" : ""})
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
