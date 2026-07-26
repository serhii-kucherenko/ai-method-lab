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
  measured: { overall: number };
  calculated: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [births, setBirths] = useState<Opt[]>([]);
  const [methods, setMethods] = useState<Opt[]>([]);
  const [assays, setAssays] = useState<Opt[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Weighed vs calculated");
  const [packId, setPackId] = useState("");
  const [birthId, setBirthId] = useState("");
  const [methodId, setMethodId] = useState("");
  const [assayId, setAssayId] = useState("");

  const load = async () => {
    try {
      const [p, b, m, a, c] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/births"),
        api<{ items: Opt[] }>("/api/methods"),
        api<{ items: Opt[] }>("/api/assays"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setBirths(b.items);
      setMethods(m.items);
      setAssays(a.items);
      setCompares(c.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!birthId && b.items[0]) setBirthId(b.items[0].id);
      if (!methodId && m.items[0]) setMethodId(m.items[0].id);
      if (!assayId && a.items[0]) setAssayId(a.items[0].id);
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
        body: JSON.stringify({ name, packId, birthId, methodId, assayId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Run weighed_swab_measured against haemoglobin_calculated and lock only when deltas and honesty are clear."
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
          <Label htmlFor="birth">Birth</Label>
          <select id="birth" className="w-full rounded-md border px-3 py-2 text-sm" value={birthId} onChange={(e) => setBirthId(e.target.value)} required>
            {births.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
          <Label htmlFor="method">Method</Label>
          <select id="method" className="w-full rounded-md border px-3 py-2 text-sm" value={methodId} onChange={(e) => setMethodId(e.target.value)} required>
            {methods.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
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
                Winner: {c.winner} · gap {c.gap} · measured {c.measured.overall} · calculated {c.calculated.overall}
              </p>
            </li>
          ))}
          {compares.length === 0 ? (
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              No compares yet — run one to see weighed-swab vs haemoglobin deltas.
            </p>
          ) : null}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
