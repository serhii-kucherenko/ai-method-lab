"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Row = {
  id: string;
  label: string;
  kind: string;
  ionExchangeFidelity: number;
  conventionalCapacity: number;
  status: string;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [waters, setWaters] = useState<Opt[]>([]);
  const [sorbents, setSorbents] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [waterId, setWaterId] = useState("");
  const [sorbentId, setSorbentId] = useState("");
  const [label, setLabel] = useState("");
  const [ion, setIon] = useState("0.55");
  const [conv, setConv] = useState("0.35");

  const load = async () => {
    try {
      const [p, w, s, a] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/waters"),
        api<{ items: Opt[] }>("/api/sorbents"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setWaters(w.items);
      setSorbents(s.items);
      setItems(a.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!waterId && w.items[0]) setWaterId(w.items[0].id);
      if (!sorbentId && s.items[0]) setSorbentId(s.items[0].id);
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
          waterId,
          sorbentId,
          label,
          kind: "lead_uptake",
          ionExchangeFidelity: Number(ion),
          conventionalCapacity: Number(conv),
          assayFidelity: 0.7,
          assayReadout: 0.65,
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
      subtitle="Record heavy-metal uptake assay runs tied to waters and sorbents."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)} required>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="water">Water</Label>
          <select id="water" className="w-full rounded-md border px-3 py-2 text-sm" value={waterId} onChange={(e) => setWaterId(e.target.value)} required>
            {waters.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
          <Label htmlFor="sorbent">Sorbent</Label>
          <select id="sorbent" className="w-full rounded-md border px-3 py-2 text-sm" value={sorbentId} onChange={(e) => setSorbentId(e.target.value)} required>
            {sorbents.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="ion">Ion-exchange fidelity</Label>
          <Input id="ion" value={ion} onChange={(e) => setIon(e.target.value)} />
          <Label htmlFor="conv">Conventional capacity</Label>
          <Input id="conv" value={conv} onChange={(e) => setConv(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · ion {row.ionExchangeFidelity} · conv {row.conventionalCapacity} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
