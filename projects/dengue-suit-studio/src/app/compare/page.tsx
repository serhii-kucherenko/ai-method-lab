"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  cmip6: { overall: number; thermalScore: number };
  historical: { overall: number; thermalScore: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [species, setSpecies] = useState<Ref[]>([]);
  const [populations, setPopulations] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("CMIP6 vs historical");
  const [packId, setPackId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [populationId, setPopulationId] = useState("");
  const [climateBias, setClimateBias] = useState("balanced");

  const load = async () => {
    try {
      const [packList, scenarioList, speciesList, popList, compares] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/scenarios"),
        api<{ items: Ref[] }>("/api/species"),
        api<{ items: Ref[] }>("/api/populations"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(packList.items);
      setScenarios(scenarioList.items);
      setSpecies(speciesList.items);
      setPopulations(popList.items);
      setItems(compares.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!scenarioId && scenarioList.items[0]) setScenarioId(scenarioList.items[0].id);
      if (!speciesId && speciesList.items[0]) setSpeciesId(speciesList.items[0].id);
      if (!populationId && popList.items[0]) setPopulationId(popList.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          packId,
          scenarioId,
          speciesId,
          populationId,
          climateBias,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual soft-sim: CMIP6 thermal suitability (A) versus static historical baseline (B)."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="scenario">Scenario</Label>
          <select id="scenario" className="w-full rounded-md border px-3 py-2 text-sm" value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
            {scenarios.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="species">Species</Label>
          <select id="species" className="w-full rounded-md border px-3 py-2 text-sm" value={speciesId} onChange={(e) => setSpeciesId(e.target.value)}>
            {species.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="population">Population overlay</Label>
          <select id="population" className="w-full rounded-md border px-3 py-2 text-sm" value={populationId} onChange={(e) => setPopulationId(e.target.value)}>
            {populations.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="bias">Climate bias</Label>
          <select id="bias" className="w-full rounded-md border px-3 py-2 text-sm" value={climateBias} onChange={(e) => setClimateBias(e.target.value)}>
            <option value="balanced">balanced</option>
            <option value="ssp585_first">ssp585_first</option>
            <option value="ssp126_first">ssp126_first</option>
            <option value="historical_first">historical_first</option>
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[var(--ds-teal)]">winner {row.winner} · gap {row.gap}</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">CMIP6 thermal</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--ds-teal)]" style={{ width: `${row.cmip6.overall}%` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.cmip6.overall}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">Static historical</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--ds-amber)]" style={{ width: `${row.historical.overall}%` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.historical.overall}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
