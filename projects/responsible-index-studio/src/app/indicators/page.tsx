"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & {
  status: string;
  kind: string;
  structuredDepth: number;
  checklistCoverage: number;
};

export function IndicatorsPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [countries, setCountries] = useState<Ref[]>([]);
  const [dimensions, setDimensions] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [dimensionId, setDimensionId] = useState("");
  const [label, setLabel] = useState("");
  const [structuredDepth, setStructuredDepth] = useState("0.55");
  const [checklistCoverage, setChecklistCoverage] = useState("0.35");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, c, d, i] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/countries"),
        api<{ items: Ref[] }>("/api/dimensions"),
        api<{ items: Row[] }>("/api/indicators"),
      ]);
      setPacks(p.items);
      setCountries(c.items);
      setDimensions(d.items);
      setItems(i.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!countryId && c.items[0]) setCountryId(c.items[0].id);
      if (!dimensionId && d.items[0]) setDimensionId(d.items[0].id);
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
      await api("/api/indicators", {
        method: "POST",
        body: JSON.stringify({
          packId,
          countryId,
          dimensionId,
          label,
          kind: "dual_gate_soft_sim",
          structuredDepth: Number(structuredDepth),
          checklistCoverage: Number(checklistCoverage),
          indicatorFidelity: 0.7,
          indicatorReadout: 0.65,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Indicators"
      subtitle="Record indicator runs that feed structured depth and checklist coverage into dual compares."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label>Country</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <Label>Dimension</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={dimensionId} onChange={(e) => setDimensionId(e.target.value)}>
            {dimensions.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="sd">Structured depth</Label>
          <Input id="sd" value={structuredDepth} onChange={(e) => setStructuredDepth(e.target.value)} required />
          <Label htmlFor="cc">Checklist coverage</Label>
          <Input id="cc" value={checklistCoverage} onChange={(e) => setChecklistCoverage(e.target.value)} required />
          <Button type="submit">Add indicator run</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · structured {row.structuredDepth} · checklist {row.checklistCoverage}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default IndicatorsPage;
