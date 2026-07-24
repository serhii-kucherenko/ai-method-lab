"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  DataOperation,
  OutcomeForecast,
  PlanProfile,
  ScoreMode,
} from "@/store";

export default function ForecastsPage() {
  const [operations, setOperations] = useState<DataOperation[]>([]);
  const [items, setItems] = useState<OutcomeForecast[]>([]);
  const [operationId, setOperationId] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScoreMode>("world-model");
  const [profile, setProfile] = useState<PlanProfile>("balanced");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: OutcomeForecast[] }>(
        "/api/forecasts?page=1&pageSize=30",
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const ops = await api<{ items: DataOperation[] }>(
        "/api/operations?page=1&pageSize=50",
      );
      setOperations(ops.items);
      if (ops.items[0]) setOperationId(ops.items[0].id);
      const fc = await api<{ items: OutcomeForecast[] }>(
        "/api/forecasts?page=1&pageSize=30",
      );
      setItems(fc.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<OutcomeForecast>("/api/forecasts", {
          method: "POST",
          body: JSON.stringify({ operationId, name, mode, profile }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Forecasts"
      subtitle="Pre-execution outcome forecasts from world-model plans or trial-and-error baselines."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run forecast</p>
          <div>
            <Label htmlFor="f-op">Operation</Label>
            <select
              id="f-op"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={operationId}
              onChange={(e) => setOperationId(e.target.value)}
            >
              {operations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="f-name">Name</Label>
            <Input
              id="f-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="World-model pre-run"
            />
          </div>
          <div>
            <Label htmlFor="f-mode">Mode</Label>
            <select
              id="f-mode"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as ScoreMode)}
            >
              <option value="world-model">world-model</option>
              <option value="trial-error">trial-error</option>
            </select>
          </div>
          <div>
            <Label htmlFor="f-profile">Profile</Label>
            <select
              id="f-profile"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={profile}
              onChange={(e) => setProfile(e.target.value as PlanProfile)}
            >
              <option value="balanced">balanced</option>
              <option value="aggressive">aggressive</option>
            </select>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !operationId}
            onClick={create}
          >
            Forecast outcome
          </Button>
        </div>

        <ul className="space-y-3">
          {items.map((f) => (
            <li
              key={f.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{f.name}</p>
                <Badge>{f.mode}</Badge>
                <Badge variant="secondary">{f.status}</Badge>
              </div>
              {f.quality ? (
                <div className="mt-3 space-y-2">
                  {[
                    ["Outcome accuracy", f.quality.outcomeAccuracy],
                    ["Cost efficiency", f.quality.costEfficiency],
                    ["Waste avoided", f.quality.wasteAvoided],
                    ["Overall", f.quality.overall],
                  ].map(([label, pct], i) => (
                    <div key={String(label)} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded bg-slate-100">
                        <div
                          className="animate-bar-grow h-full rounded bg-[var(--studio-teal)]"
                          style={{
                            width: `${pct}%`,
                            animationDelay: `${i * 80}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              {f.readiness ? (
                <p className="mt-2 text-xs text-slate-500">
                  Ready: {f.readiness.overallReady ? "yes" : "gaps remain"} ·
                  accuracy gap {f.readiness.accuracyGap}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
