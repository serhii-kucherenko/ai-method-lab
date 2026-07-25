"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  multimodal: { overall: number };
  singleBaseline: { overall: number };
};

type Ref = { id: string; label?: string };

export default function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [stresses, setStresses] = useState<Ref[]>([]);
  const [sensors, setSensors] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [name, setName] = useState(
    "Multimodal wearable vs single-sensor baseline",
  );
  const [stressId, setStressId] = useState("");
  const [sensorId, setSensorId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, ss, cs, rs] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Ref[] }>("/api/stress"),
      api<{ items: Ref[] }>("/api/sensors"),
      api<{ items: Ref[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setStresses(ss.items);
    setSensors(cs.items);
    setRuns(rs.items);
    if (!stressId && ss.items[0]) setStressId(ss.items[0].id);
    if (!sensorId && cs.items[0]) setSensorId(cs.items[0].id);
    if (!runId && rs.items[0]) setRunId(rs.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, stressId, sensorId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Multimodal wearable stress sensing (A) versus single-sensor baseline (B)."
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
          <Label htmlFor="stress">Stress signal</Label>
          <select
            id="stress"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={stressId}
            onChange={(e) => setStressId(e.target.value)}
          >
            {stresses.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="sensor">Sensor config</Label>
          <select
            id="sensor"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          >
            {sensors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Clip run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={run}>Run A/B compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · A {c.multimodal.overall} · B{" "}
              {c.singleBaseline.overall}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--fc-sap)]"
                style={{ width: `${c.multimodal.overall}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
