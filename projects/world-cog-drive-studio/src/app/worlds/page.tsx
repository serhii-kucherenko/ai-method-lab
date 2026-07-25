"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type World = {
  id: string;
  packId: string;
  label: string;
  corridor: string;
  forecastHorizon: number;
  worldWeight: number;
  status: string;
};

export default function WorldsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<World[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Dual-horizon world forecast");
  const [corridor, setCorridor] = useState("merge");
  const [forecastHorizon, setForecastHorizon] = useState("14");
  const [worldWeight, setWorldWeight] = useState("0.65");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, w] = await Promise.all([
      api<{ items: Pack[] }>("/api/routes"),
      api<{ items: World[] }>(`/api/worlds?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(w.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/worlds", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          corridor,
          forecastHorizon: Number(forecastHorizon),
          worldWeight: Number(worldWeight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="World forecasts"
      subtitle="Configure dual-level world forecasts and world vs action weights before scoring."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search worlds"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Route pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="world-label">Label</Label>
          <Input
            id="world-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="corridor">Corridor</Label>
          <Input
            id="corridor"
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="horizon">Forecast horizon</Label>
          <Input
            id="horizon"
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">World weight</Label>
          <Input
            id="weight"
            value={worldWeight}
            onChange={(e) => setWorldWeight(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create world config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((w) => (
          <li
            key={w.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{w.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {w.corridor} · horizon {w.forecastHorizon} · world{" "}
              {w.worldWeight} · {w.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
