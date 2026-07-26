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
  mpsPreservation: number;
  culture2dMasking: number;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [tubules, setTubules] = useState<Opt[]>([]);
  const [regimens, setRegimens] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [tubuleId, setTubuleId] = useState("");
  const [regimenId, setRegimenId] = useState("");
  const [label, setLabel] = useState("Mitochondrial dual-MPS soft-sim");
  const [mpsPreservation, setMpsPreservation] = useState("0.55");
  const [cyclosporineHarm, setCyclosporineHarm] = useState("0.35");
  const [culture2dMasking, setCulture2dMasking] = useState("0.7");
  const [assayReadout, setAssayReadout] = useState("0.65");

  const load = async () => {
    try {
      const [p, t, r, a] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/tubules"),
        api<{ items: Opt[] }>("/api/regimens"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setTubules(t.items);
      setRegimens(r.items);
      setItems(a.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!tubuleId && t.items[0]) setTubuleId(t.items[0].id);
      if (!regimenId && r.items[0]) setRegimenId(r.items[0].id);
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
          tubuleId,
          regimenId,
          label,
          kind: "dual_mps_soft_sim",
          mpsPreservation: Number(mpsPreservation),
          cyclosporineHarm: Number(cyclosporineHarm),
          culture2dMasking: Number(culture2dMasking),
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
      subtitle="Capture mitochondrial preservation, cyclosporine harm, and 2D masking for dual soft-sims."
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
          <Label htmlFor="tubule">Tubule</Label>
          <select id="tubule" className="w-full rounded-md border px-3 py-2 text-sm" value={tubuleId} onChange={(e) => setTubuleId(e.target.value)} required>
            {tubules.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <Label htmlFor="regimen">Regimen</Label>
          <select id="regimen" className="w-full rounded-md border px-3 py-2 text-sm" value={regimenId} onChange={(e) => setRegimenId(e.target.value)} required>
            {regimens.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <Label htmlFor="mps">MPS preservation</Label>
          <Input id="mps" value={mpsPreservation} onChange={(e) => setMpsPreservation(e.target.value)} />
          <Label htmlFor="csa">Cyclosporine harm</Label>
          <Input id="csa" value={cyclosporineHarm} onChange={(e) => setCyclosporineHarm(e.target.value)} />
          <Label htmlFor="mask">2D culture masking</Label>
          <Input id="mask" value={culture2dMasking} onChange={(e) => setCulture2dMasking(e.target.value)} />
          <Label htmlFor="readout">Assay readout</Label>
          <Input id="readout" value={assayReadout} onChange={(e) => setAssayReadout(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · MPS {row.mpsPreservation} · 2D mask {row.culture2dMasking}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
