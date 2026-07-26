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
  cfir: { overall: number };
  statusQuo: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [districts, setDistricts] = useState<Ref[]>([]);
  const [pathways, setPathways] = useState<Ref[]>([]);
  const [fidelity, setFidelity] = useState<Ref[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [name, setName] = useState("District A/B soft-sim");
  const [packId, setPackId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [pathwayId, setPathwayId] = useState("");
  const [fidelityId, setFidelityId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, d, pw, f, c] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/districts"),
        api<{ items: Ref[] }>("/api/pathways"),
        api<{ items: Ref[] }>("/api/fidelity"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setDistricts(d.items);
      setPathways(pw.items);
      setFidelity(f.items);
      setCompares(c.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!districtId && d.items[0]) setDistrictId(d.items[0].id);
      if (!pathwayId && pw.items[0]) setPathwayId(pw.items[0].id);
      if (!fidelityId && f.items[0]) setFidelityId(f.items[0].id);
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
          districtId,
          pathwayId,
          fidelityId,
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
      subtitle="Run CFIR co-design primary care against status-quo pathway soft-sims and inspect the gap."
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
          <Label>District</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
          <Label>Pathway</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={pathwayId} onChange={(e) => setPathwayId(e.target.value)}>
            {pathways.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label>Fidelity run</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={fidelityId} onChange={(e) => setFidelityId(e.target.value)}>
            {fidelity.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {compares.map((c) => (
            <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {c.winner} · gap {c.gap} · CFIR {c.cfir.overall} vs status-quo {c.statusQuo.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
