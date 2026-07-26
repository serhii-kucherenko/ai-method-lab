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
  structured: { overall: number };
  checklist: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [countries, setCountries] = useState<Ref[]>([]);
  const [dimensions, setDimensions] = useState<Ref[]>([]);
  const [indicators, setIndicators] = useState<Ref[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [name, setName] = useState("Index A/B soft-sim");
  const [packId, setPackId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [dimensionId, setDimensionId] = useState("");
  const [indicatorId, setIndicatorId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, c, d, i, cmp] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/countries"),
        api<{ items: Ref[] }>("/api/dimensions"),
        api<{ items: Ref[] }>("/api/indicators"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setCountries(c.items);
      setDimensions(d.items);
      setIndicators(i.items);
      setCompares(cmp.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!countryId && c.items[0]) setCountryId(c.items[0].id);
      if (!dimensionId && d.items[0]) setDimensionId(d.items[0].id);
      if (!indicatorId && i.items[0]) setIndicatorId(i.items[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
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
          countryId,
          dimensionId,
          indicatorId,
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
      subtitle="Run structured_country_index against naive_commitment_checklist soft-sims and inspect the gap."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label>Country</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
            {countries.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <Label>Dimension</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={dimensionId} onChange={(e) => setDimensionId(e.target.value)}>
            {dimensions.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <Label>Indicator</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={indicatorId} onChange={(e) => setIndicatorId(e.target.value)}>
            {indicators.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {compares.map((c) => (
            <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {c.winner} · gap {c.gap} · structured {c.structured.overall} vs checklist {c.checklist.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
