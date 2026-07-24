"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  AgentFleet,
  AlertEvent,
  AlertSeverity,
  ScoreMode,
} from "@/store";

export default function AlertsPage() {
  const [fleets, setFleets] = useState<AgentFleet[]>([]);
  const [items, setItems] = useState<AlertEvent[]>([]);
  const [fleetId, setFleetId] = useState("");
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<AlertSeverity>("high");
  const [mode, setMode] = useState<ScoreMode>("structural");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(fid = fleetId) {
    start(async () => {
      const f = await api<{ items: AgentFleet[] }>(
        "/api/fleets?page=1&pageSize=50",
      );
      setFleets(f.items);
      const nextFleet = fid || f.items[0]?.id || "";
      if (!fleetId && nextFleet) setFleetId(nextFleet);
      const a = await api<{ items: AlertEvent[] }>(
        `/api/alerts?fleetId=${encodeURIComponent(nextFleet || fid)}&page=1&pageSize=20`,
      );
      setItems(a.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<AlertEvent>("/api/alerts", {
          method: "POST",
          body: JSON.stringify({ fleetId, title, severity, mode }),
        });
        setTitle("");
        setError("");
        load(fleetId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function advance(id: string, status: AlertEvent["status"]) {
    start(async () => {
      await api<AlertEvent>("/api/alerts", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      });
      load(fleetId);
    });
  }

  return (
    <StudioShell
      title="Regression alerts"
      subtitle="Suspicion console for structural security regressions before ship."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Raise alert</p>
          <div>
            <Label htmlFor="a-fleet">Fleet</Label>
            <select
              id="a-fleet"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={fleetId}
              onChange={(e) => {
                setFleetId(e.target.value);
                load(e.target.value);
              }}
            >
              {fleets.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="a-title">Title</Label>
            <Input
              id="a-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Deny guard removed in synth"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="a-sev">Severity</Label>
              <select
                id="a-sev"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
              >
                {(["low", "medium", "high", "critical"] as const).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="a-mode">Score mode</Label>
              <select
                id="a-mode"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={mode}
                onChange={(e) => setMode(e.target.value as ScoreMode)}
              >
                <option value="structural">structural</option>
                <option value="threshold">threshold</option>
              </select>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !title.trim() || !fleetId} onClick={create}>
            Raise alert
          </Button>
        </div>

        <ul className="space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className={`rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 ${
                a.status === "open" ? "animate-alert-pulse" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{a.title}</p>
                <Badge>{a.severity}</Badge>
                <Badge variant="outline">{a.status}</Badge>
                <Badge variant="secondary">suspicion {a.suspicion}</Badge>
              </div>
              <p className="mt-2 text-sm text-stone-500">{a.detail}</p>
              {a.quality ? (
                <p className="mt-1 text-xs text-stone-400">
                  Catch {a.quality.structuralCatchRate} · sync block{" "}
                  {a.quality.syncBlockEffectiveness} · overall{" "}
                  {a.quality.overall}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {a.status === "open" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => advance(a.id, "acked")}
                  >
                    Ack
                  </Button>
                ) : null}
                {a.status === "acked" || a.status === "open" ? (
                  <Button size="sm" onClick={() => advance(a.id, "resolved")}>
                    Resolve
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
