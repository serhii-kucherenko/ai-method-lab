"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Ref = { id: string; label: string };

export function SpeciesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("aedes_aegypti");
  const [nicheHint, setNicheHint] = useState("urban-container-breeder");
  const [nicheFloor, setNicheFloor] = useState("0.4");
  const [stickinessCeiling, setStickinessCeiling] = useState("0.35");

  const load = async () => {
    try {
      const [speciesList, packList] = await Promise.all([
        api<{ items: Row[] }>("/api/species"),
        api<{ items: Ref[] }>("/api/packs"),
      ]);
      setItems(speciesList.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/species", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          nicheHint,
          nicheFloor: Number(nicheFloor),
          stickinessCeiling: Number(stickinessCeiling),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/species", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Vector species"
      subtitle="Specify mosquito niche soft-sim parameters — not operational mosquito control deployment."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Species kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="aedes_aegypti">aedes_aegypti</option>
            <option value="aedes_albopictus">aedes_albopictus</option>
            <option value="mixed_vector">mixed_vector</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="niche">Niche hint</Label>
          <Input id="niche" value={nicheHint} onChange={(e) => setNicheHint(e.target.value)} />
          <Label htmlFor="floor">Niche floor</Label>
          <Input id="floor" value={nicheFloor} onChange={(e) => setNicheFloor(e.target.value)} />
          <Label htmlFor="stick">Stickiness ceiling</Label>
          <Input id="stick" value={stickinessCeiling} onChange={(e) => setStickinessCeiling(e.target.value)} />
          <Button type="submit">Create species</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {String(row.kind)} · {String(row.nicheHint)} · {row.status}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default SpeciesPage;
