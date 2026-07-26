"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string };
type Ref = { id: string; label: string };

export function PopulationsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [species, setSpecies] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("urban_density");
  const [thermalSuitIndex, setThermalSuitIndex] = useState("0.7");
  const [populationAtRisk, setPopulationAtRisk] = useState("0.65");
  const [climateShiftSignal, setClimateShiftSignal] = useState("0.7");
  const [assaySignal, setAssaySignal] = useState("0.7");

  const load = async () => {
    try {
      const [popList, packList, scenarioList, speciesList] = await Promise.all([
        api<{ items: Row[] }>("/api/populations"),
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/scenarios"),
        api<{ items: Ref[] }>("/api/species"),
      ]);
      setItems(popList.items);
      setPacks(packList.items);
      setScenarios(scenarioList.items);
      setSpecies(speciesList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!scenarioId && scenarioList.items[0]) setScenarioId(scenarioList.items[0].id);
      if (!speciesId && speciesList.items[0]) setSpeciesId(speciesList.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/populations", {
        method: "POST",
        body: JSON.stringify({
          packId,
          scenarioId,
          speciesId,
          label,
          kind,
          thermalSuitIndex: Number(thermalSuitIndex),
          populationAtRisk: Number(populationAtRisk),
          climateShiftSignal: Number(climateShiftSignal),
          assaySignal: Number(assaySignal),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Population overlays"
      subtitle="Attach population-at-risk overlays to a scenario and species niche for thermal-suitability soft-sim."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
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
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Overlay kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="urban_density">urban_density</option>
            <option value="peri_urban">peri_urban</option>
            <option value="rural_dispersed">rural_dispersed</option>
            <option value="mixed_exposure">mixed_exposure</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="thermal">Thermal suit index</Label>
          <Input id="thermal" value={thermalSuitIndex} onChange={(e) => setThermalSuitIndex(e.target.value)} />
          <Label htmlFor="par">Population at risk</Label>
          <Input id="par" value={populationAtRisk} onChange={(e) => setPopulationAtRisk(e.target.value)} />
          <Label htmlFor="shift">Climate shift signal</Label>
          <Input id="shift" value={climateShiftSignal} onChange={(e) => setClimateShiftSignal(e.target.value)} />
          <Label htmlFor="assay">Assay signal</Label>
          <Input id="assay" value={assaySignal} onChange={(e) => setAssaySignal(e.target.value)} />
          <Button type="submit">Create overlay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {String(row.kind)} · thermal {String(row.thermalSuitIndex)} · PAR {String(row.populationAtRisk)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default PopulationsPage;
