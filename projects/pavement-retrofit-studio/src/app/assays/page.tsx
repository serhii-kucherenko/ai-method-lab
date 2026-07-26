"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  kind: string;
  noxBaseline: number;
  co2Baseline: number;
  tio2Loading: number;
  assaySignal: number;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [corridorId, setCorridorId] = useState("corridor-demo");
  const [treatmentId, setTreatmentId] = useState("treatment-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("nox_reduction");
  const [noxBaseline, setNoxBaseline] = useState("0.32");
  const [co2Baseline, setCo2Baseline] = useState("0.28");
  const [tio2Loading, setTio2Loading] = useState("0.42");
  const [assaySignal, setAssaySignal] = useState("0.7");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/assays")).items);
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
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          packId,
          corridorId,
          treatmentId,
          label,
          kind,
          noxBaseline: Number(noxBaseline),
          co2Baseline: Number(co2Baseline),
          tio2Loading: Number(tio2Loading),
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
      title="Assays"
      subtitle="Emission and durability assay soft-sims — proxies only, not certified audits."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="corridorId">Corridor id</Label>
          <Input id="corridorId" value={corridorId} onChange={(e) => setCorridorId(e.target.value)} required />
          <Label htmlFor="treatmentId">Treatment id</Label>
          <Input id="treatmentId" value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="nox">NOx baseline</Label>
          <Input id="nox" value={noxBaseline} onChange={(e) => setNoxBaseline(e.target.value)} required />
          <Label htmlFor="co2">CO2 baseline</Label>
          <Input id="co2" value={co2Baseline} onChange={(e) => setCo2Baseline(e.target.value)} required />
          <Label htmlFor="tio2">TiO2 loading</Label>
          <Input id="tio2" value={tio2Loading} onChange={(e) => setTio2Loading(e.target.value)} required />
          <Label htmlFor="signal">Assay signal</Label>
          <Input id="signal" value={assaySignal} onChange={(e) => setAssaySignal(e.target.value)} required />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · NOx {row.noxBaseline} · CO2 {row.co2Baseline} · TiO2 {row.tio2Loading} · signal {row.assaySignal}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
