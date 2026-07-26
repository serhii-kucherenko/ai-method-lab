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
  dockingFit: number;
  pharmacophoreMatch: number;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [screens, setScreens] = useState<Opt[]>([]);
  const [hits, setHits] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [screenId, setScreenId] = useState("");
  const [hitId, setHitId] = useState("");
  const [label, setLabel] = useState("Structure / library dual soft-sim");
  const [dockingFit, setDockingFit] = useState("0.55");
  const [libraryHitRate, setLibraryHitRate] = useState("0.35");
  const [pharmacophoreMatch, setPharmacophoreMatch] = useState("0.7");
  const [assayReadout, setAssayReadout] = useState("0.65");

  const load = async () => {
    try {
      const [p, a, v, assays] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/screens"),
        api<{ items: Opt[] }>("/api/hits"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setScreens(a.items);
      setHits(v.items);
      setItems(assays.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!screenId && a.items[0]) setScreenId(a.items[0].id);
      if (!hitId && v.items[0]) setHitId(v.items[0].id);
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
          screenId,
          hitId,
          label,
          kind: "dual_screen_soft_sim",
          dockingFit: Number(dockingFit),
          libraryHitRate: Number(libraryHitRate),
          pharmacophoreMatch: Number(pharmacophoreMatch),
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
      subtitle="Capture docking fit, library hit rate, and pharmacophore signals for dual soft-sims."
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
          <Label htmlFor="screen">Screen</Label>
          <select id="screen" className="w-full rounded-md border px-3 py-2 text-sm" value={screenId} onChange={(e) => setScreenId(e.target.value)} required>
            {screens.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <Label htmlFor="hit">Hit</Label>
          <select id="hit" className="w-full rounded-md border px-3 py-2 text-sm" value={hitId} onChange={(e) => setHitId(e.target.value)} required>
            {hits.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <Label htmlFor="dock">Docking fit</Label>
          <Input id="dock" value={dockingFit} onChange={(e) => setDockingFit(e.target.value)} />
          <Label htmlFor="library">Library hit rate</Label>
          <Input id="library" value={libraryHitRate} onChange={(e) => setLibraryHitRate(e.target.value)} />
          <Label htmlFor="pharm">Pharmacophore match</Label>
          <Input id="pharm" value={pharmacophoreMatch} onChange={(e) => setPharmacophoreMatch(e.target.value)} />
          <Label htmlFor="readout">Assay readout</Label>
          <Input id="readout" value={assayReadout} onChange={(e) => setAssayReadout(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · dock {row.dockingFit} · pharm {row.pharmacophoreMatch}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
