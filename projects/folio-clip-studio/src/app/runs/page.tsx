"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  stressId: string;
  sensorId: string;
  clipCoverage: number;
  multimodalFidelity: number;
  sensorClarity: number;
  runStability: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [stresses, setStresses] = useState<Ref[]>([]);
  const [sensors, setSensors] = useState<Ref[]>([]);
  const [stressId, setStressId] = useState("");
  const [sensorId, setSensorId] = useState("");
  const [clipCoverage, setClipCoverage] = useState("0.62");
  const [multimodalFidelity, setMultimodalFidelity] = useState("0.7");
  const [sensorClarity, setSensorClarity] = useState("0.74");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, ss, cs] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/stress"),
      api<{ items: Ref[] }>("/api/sensors"),
    ]);
    setItems(runs.items);
    setStresses(ss.items);
    setSensors(cs.items);
    if (!stressId && ss.items[0]) setStressId(ss.items[0].id);
    if (!sensorId && cs.items[0]) setSensorId(cs.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          stressId,
          sensorId,
          clipCoverage: Number(clipCoverage),
          multimodalFidelity: Number(multimodalFidelity),
          sensorClarity: Number(sensorClarity),
          runStability: Number(runStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Clip runs"
      subtitle="Soft-sim runs that feed multimodal vs single-sensor compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="stress">Stress signal</Label>
          <select
            id="stress"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={stressId}
            onChange={(e) => setStressId(e.target.value)}
          >
            {stresses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
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
            {sensors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Clip coverage</Label>
          <Input
            id="cov"
            value={clipCoverage}
            onChange={(e) => setClipCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Multimodal fidelity</Label>
          <Input
            id="fid"
            value={multimodalFidelity}
            onChange={(e) => setMultimodalFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clar">Sensor clarity</Label>
          <Input
            id="clar"
            value={sensorClarity}
            onChange={(e) => setSensorClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stab">Run stability</Label>
          <Input
            id="stab"
            value={runStability}
            onChange={(e) => setRunStability(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              cov {r.clipCoverage} · fid {r.multimodalFidelity} · clar{" "}
              {r.sensorClarity} · stab {r.runStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
