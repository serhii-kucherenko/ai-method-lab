"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  esClosedLoop: { overall: number };
  openLoopGradient: { overall: number };
};

export default function ComparePage() {
  const [sensors, setSensors] = useState<Entity[]>([]);
  const [actuators, setActuators] = useState<Entity[]>([]);
  const [runs, setRuns] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("ES vs open-loop compare");
  const [sensorId, setSensorId] = useState("");
  const [actuatorId, setActuatorId] = useState("");
  const [controllerRunId, setControllerRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, a, r, c] = await Promise.all([
      api<{ items: Entity[] }>("/api/sensors"),
      api<{ items: Entity[] }>("/api/actuators"),
      api<{ items: Entity[] }>("/api/controllers"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setSensors(s.items);
    setActuators(a.items);
    setRuns(r.items);
    setItems(c.items);
    if (!sensorId && s.items[0]) setSensorId(s.items[0].id);
    if (!actuatorId && a.items[0]) setActuatorId(a.items[0].id);
    if (!controllerRunId && r.items[0]) setControllerRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          sensorId,
          actuatorId,
          controllerRunId,
          bias: "balanced",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="ES closed-loop wall controller vs open-loop / gradient baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sensor">Sensor layout</Label>
          <select
            id="sensor"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          >
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="actuator">Actuator plan</Label>
          <select
            id="actuator"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={actuatorId}
            onChange={(e) => setActuatorId(e.target.value)}
          >
            {actuators.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label ?? a.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Controller run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={controllerRunId}
            onChange={(e) => setControllerRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No compares yet — run one above.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>
                  <div className="text-xs text-slate-500">ES closed-loop</div>
                  <div className="mt-1 h-2 rounded bg-slate-100">
                    <div
                      className="score-bar h-2 rounded bg-[var(--studio-cyan)]"
                      style={{ width: `${c.esClosedLoop.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">{c.esClosedLoop.overall}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Open-loop / gradient</div>
                  <div className="mt-1 h-2 rounded bg-slate-100">
                    <div
                      className="score-bar h-2 rounded bg-slate-400"
                      style={{ width: `${c.openLoopGradient.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.openLoopGradient.overall}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  winner <strong>{c.winner}</strong> · gap {c.gap}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
