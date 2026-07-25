"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Run = {
  id: string;
  scenarioId: string;
  modelId: string;
  waterIntensity: number;
  energyIntensity: number;
  emissionsClarity: number;
  scenarioStability: number;
  status: string;
};

export default function RunsPage() {
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [models, setModels] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [scenarioId, setScenarioId] = useState("");
  const [modelId, setModelId] = useState("");
  const [waterIntensity, setWaterIntensity] = useState("0.62");
  const [energyIntensity, setEnergyIntensity] = useState("0.70");
  const [emissionsClarity, setEmissionsClarity] = useState("0.74");
  const [scenarioStability, setScenarioStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [s, m, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/scenarios"),
      api<{ items: Ref[] }>("/api/models"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setScenarios(s.items);
    setModels(m.items);
    setItems(r.items);
    if (!scenarioId && s.items[0]) setScenarioId(s.items[0].id);
    if (!modelId && m.items[0]) setModelId(m.items[0].id);
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
          scenarioId,
          modelId,
          waterIntensity: Number(waterIntensity),
          energyIntensity: Number(energyIntensity),
          emissionsClarity: Number(emissionsClarity),
          scenarioStability: Number(scenarioStability),
          reviewerNotes: "Soft-sim cost run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Cost runs"
      subtitle="Soft-sim runs that capture water, energy, emissions clarity, and scenario stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="scenario">Scenario</Label>
          <select
            id="scenario"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <select
            id="model"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="water">Water intensity</Label>
          <Input id="water" value={waterIntensity} onChange={(e) => setWaterIntensity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="energy">Energy intensity</Label>
          <Input id="energy" value={energyIntensity} onChange={(e) => setEnergyIntensity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="emis">Emissions clarity</Label>
          <Input id="emis" value={emissionsClarity} onChange={(e) => setEmissionsClarity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="stab">Scenario stability</Label>
          <Input id="stab" value={scenarioStability} onChange={(e) => setScenarioStability(e.target.value)} />
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
            <div className="font-medium">{r.id.slice(0, 8)}…</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              water {r.waterIntensity} · energy {r.energyIntensity} · emissions{" "}
              {r.emissionsClarity} · stability {r.scenarioStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
