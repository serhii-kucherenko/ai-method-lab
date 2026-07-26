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
  coverage65Plus: number;
  eivUptakeShare: number;
  status: string;
};

export function OutcomesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [countryId, setCountryId] = useState("country-demo");
  const [programId, setProgramId] = useState("program-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("hospitalizations_averted");
  const [coverage65Plus, setCoverage] = useState("0.7");
  const [eivUptakeShare, setEiv] = useState("0.65");
  const [winterBurdenIndex, setWinter] = useState("0.3");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/outcomes")).items);
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
      await api("/api/outcomes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          countryId,
          programId,
          label,
          kind,
          coverage65Plus: Number(coverage65Plus),
          eivUptakeShare: Number(eivUptakeShare),
          winterBurdenIndex: Number(winterBurdenIndex),
          assaySignal: 0.7,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Outcomes"
      subtitle="Record outcome metric runs — hospitalizations, GP visits, winter burden — as soft-sim inputs for dual compare."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="countryId">Country id</Label>
          <Input id="countryId" value={countryId} onChange={(e) => setCountryId(e.target.value)} required />
          <Label htmlFor="programId">Program id</Label>
          <Input id="programId" value={programId} onChange={(e) => setProgramId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Outcome kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="coverage">Coverage ≥65</Label>
          <Input id="coverage" value={coverage65Plus} onChange={(e) => setCoverage(e.target.value)} />
          <Label htmlFor="eiv">EIV uptake share</Label>
          <Input id="eiv" value={eivUptakeShare} onChange={(e) => setEiv(e.target.value)} />
          <Label htmlFor="winter">Winter burden</Label>
          <Input id="winter" value={winterBurdenIndex} onChange={(e) => setWinter(e.target.value)} />
          <Button type="submit">Create outcome</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · cov {row.coverage65Plus} · eiv {row.eivUptakeShare} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default OutcomesPage;
