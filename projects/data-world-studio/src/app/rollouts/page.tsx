"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { AgentProfile, OutcomeForecast, RolloutRun } from "@/store";

export default function RolloutsPage() {
  const [forecasts, setForecasts] = useState<OutcomeForecast[]>([]);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [items, setItems] = useState<RolloutRun[]>([]);
  const [forecastId, setForecastId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: RolloutRun[] }>("/api/rollouts");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const [fc, ag, rolls] = await Promise.all([
        api<{ items: OutcomeForecast[] }>("/api/forecasts?page=1&pageSize=50"),
        api<{ items: AgentProfile[] }>("/api/agents"),
        api<{ items: RolloutRun[] }>("/api/rollouts"),
      ]);
      setForecasts(fc.items);
      setAgents(ag.items);
      setItems(rolls.items);
      if (fc.items[0]) setForecastId(fc.items[0].id);
      if (ag.items[0]) setAgentId(ag.items[0].id);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<RolloutRun>("/api/rollouts", {
          method: "POST",
          body: JSON.stringify({ forecastId, agentId, label }),
        });
        setLabel("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Rollouts"
      subtitle="Compare planned forecast overall to executed outcomes with a short timeline."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Start rollout</p>
          <div>
            <Label htmlFor="r-fc">Forecast</Label>
            <select
              id="r-fc"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={forecastId}
              onChange={(e) => setForecastId(e.target.value)}
            >
              {forecasts.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="r-ag">Agent</Label>
            <select
              id="r-ag"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="r-label">Label</Label>
            <Input
              id="r-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Optional label"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !forecastId || !agentId}
            onClick={create}
          >
            Record rollout
          </Button>
        </div>

        <ul className="space-y-3">
          {items.map((r, idx) => (
            <li
              key={r.id}
              className="animate-rollout-reveal rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{r.label}</p>
                <Badge>{r.status}</Badge>
                <Badge variant="secondary">Δ {r.delta}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Planned {r.plannedOverall}% · Executed {r.executedOverall}%
              </p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-slate-500">
                {r.timeline.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
