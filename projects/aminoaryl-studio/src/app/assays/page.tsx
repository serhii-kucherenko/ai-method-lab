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
  photoYield: number;
  cyclopropaneStrain: number;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [routes, setRoutes] = useState<Opt[]>([]);
  const [catalysts, setCatalysts] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [catalystId, setCatalystId] = useState("");
  const [label, setLabel] = useState("Photo / copper dual soft-sim");
  const [photoYield, setPhotoYield] = useState("0.55");
  const [copperYield, setCopperYield] = useState("0.35");
  const [cyclopropaneStrain, setCyclopropaneStrain] = useState("0.7");
  const [assayReadout, setAssayReadout] = useState("0.65");

  const load = async () => {
    try {
      const [p, a, v, assays] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/routes"),
        api<{ items: Opt[] }>("/api/catalysts"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setRoutes(a.items);
      setCatalysts(v.items);
      setItems(assays.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!routeId && a.items[0]) setRouteId(a.items[0].id);
      if (!catalystId && v.items[0]) setCatalystId(v.items[0].id);
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
          routeId,
          catalystId,
          label,
          kind: "dual_route_soft_sim",
          photoYield: Number(photoYield),
          copperYield: Number(copperYield),
          cyclopropaneStrain: Number(cyclopropaneStrain),
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
      subtitle="Capture photocatalytic yield, copper yield, and cyclopropane-strain signals for dual soft-sims."
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
          <Label htmlFor="route">Route</Label>
          <select id="route" className="w-full rounded-md border px-3 py-2 text-sm" value={routeId} onChange={(e) => setRouteId(e.target.value)} required>
            {routes.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <Label htmlFor="catalyst">Catalyst</Label>
          <select id="catalyst" className="w-full rounded-md border px-3 py-2 text-sm" value={catalystId} onChange={(e) => setCatalystId(e.target.value)} required>
            {catalysts.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <Label htmlFor="photo">Photo yield</Label>
          <Input id="photo" value={photoYield} onChange={(e) => setPhotoYield(e.target.value)} />
          <Label htmlFor="copper">Copper yield</Label>
          <Input id="copper" value={copperYield} onChange={(e) => setCopperYield(e.target.value)} />
          <Label htmlFor="strain">Cyclopropane strain</Label>
          <Input id="strain" value={cyclopropaneStrain} onChange={(e) => setCyclopropaneStrain(e.target.value)} />
          <Label htmlFor="readout">Assay readout</Label>
          <Input id="readout" value={assayReadout} onChange={(e) => setAssayReadout(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · photo {row.photoYield} · strain {row.cyclopropaneStrain}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
