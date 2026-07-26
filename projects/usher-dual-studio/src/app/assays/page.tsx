"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Row = Opt & {
  kind: string;
  myo7aRescue: number;
  alleleGap: number;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [alleles, setAlleles] = useState<Opt[]>([]);
  const [vectors, setVectors] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [alleleId, setAlleleId] = useState("");
  const [vectorId, setVectorId] = useState("");
  const [label, setLabel] = useState("Pathway dual soft-sim");
  const [myo7aRescue, setMyo7aRescue] = useState("0.55");
  const [myo7bActivation, setMyo7bActivation] = useState("0.35");
  const [alleleGap, setAlleleGap] = useState("0.7");
  const [assayReadout, setAssayReadout] = useState("0.65");

  const load = async () => {
    try {
      const [p, a, v, assays] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/alleles"),
        api<{ items: Opt[] }>("/api/vectors"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setAlleles(a.items);
      setVectors(v.items);
      setItems(assays.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!alleleId && a.items[0]) setAlleleId(a.items[0].id);
      if (!vectorId && v.items[0]) setVectorId(v.items[0].id);
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
          alleleId,
          vectorId,
          label,
          kind: "dual_pathway_soft_sim",
          myo7aRescue: Number(myo7aRescue),
          myo7bActivation: Number(myo7bActivation),
          alleleGap: Number(alleleGap),
          assayReadout: Number(assayReadout),
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
      subtitle="Capture MYO7A rescue, Myo7b activation, and allele-gap signals for dual soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
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
          <Label htmlFor="rescue">MYO7A rescue</Label>
          <Input id="rescue" value={myo7aRescue} onChange={(e) => setMyo7aRescue(e.target.value)} />
          <Label htmlFor="act">Myo7b activation</Label>
          <Input id="act" value={myo7bActivation} onChange={(e) => setMyo7bActivation(e.target.value)} />
          <Label htmlFor="gap">Allele gap</Label>
          <Input id="gap" value={alleleGap} onChange={(e) => setAlleleGap(e.target.value)} />
          <Label htmlFor="readout">Assay readout</Label>
          <Input id="readout" value={assayReadout} onChange={(e) => setAssayReadout(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · rescue {row.myo7aRescue} · allele gap {row.alleleGap}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
