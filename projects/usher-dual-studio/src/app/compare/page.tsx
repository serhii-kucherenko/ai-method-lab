"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  myo7a: { overall: number };
  myo7b: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [alleles, setAlleles] = useState<Opt[]>([]);
  const [vectors, setVectors] = useState<Opt[]>([]);
  const [assays, setAssays] = useState<Opt[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("MYO7A supplement vs Myo7b activation");
  const [packId, setPackId] = useState("");
  const [alleleId, setAlleleId] = useState("");
  const [vectorId, setVectorId] = useState("");
  const [assayId, setAssayId] = useState("");

  const load = async () => {
    try {
      const [p, a, v, assaysRes, c] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/alleles"),
        api<{ items: Opt[] }>("/api/vectors"),
        api<{ items: Opt[] }>("/api/assays"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setAlleles(a.items);
      setVectors(v.items);
      setAssays(assaysRes.items);
      setCompares(c.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!alleleId && a.items[0]) setAlleleId(a.items[0].id);
      if (!vectorId && v.items[0]) setVectorId(v.items[0].id);
      if (!assayId && assaysRes.items[0]) setAssayId(assaysRes.items[0].id);
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
        body: JSON.stringify({ name, packId, alleleId, vectorId, assayId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Run myo7a_gene_supplement against myo7b_activation and lock only when deltas and honesty are clear."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)} required>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="allele">Allele</Label>
          <select id="allele" className="w-full rounded-md border px-3 py-2 text-sm" value={alleleId} onChange={(e) => setAlleleId(e.target.value)} required>
            {alleles.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <Label htmlFor="vector">Vector</Label>
          <select id="vector" className="w-full rounded-md border px-3 py-2 text-sm" value={vectorId} onChange={(e) => setVectorId(e.target.value)} required>
            {vectors.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <Label htmlFor="assay">Assay</Label>
          <select id="assay" className="w-full rounded-md border px-3 py-2 text-sm" value={assayId} onChange={(e) => setAssayId(e.target.value)} required>
            {assays.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {compares.map((c) => (
            <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                winner {c.winner} · gap {c.gap} · MYO7A {c.myo7a.overall} · Myo7b {c.myo7b.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
