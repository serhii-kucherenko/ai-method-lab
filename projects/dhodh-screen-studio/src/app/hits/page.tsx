"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Row = Opt & { kind: string; modelHint: string; status: string };

export function HitsPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [modelHint, setModelHint] = useState("structure-dhodh-vs");
  const [kind, setKind] = useState("structure_based_dhodh");

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Row[] }>("/api/hits"),
      ]);
      setPacks(p.items);
      setItems(t.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
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
      await api("/api/hits", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          modelHint,
          yieldFloor: 0.45,
          evidenceFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Hits"
      subtitle="Configure structure-based DHODH and naive library hit specs for soft-sim packs."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
            required
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="structure_based_dhodh">structure_based_dhodh</option>
            <option value="naive_library_baseline">naive_library_baseline</option>
            <option value="dock_pharmacophore_soft_sim">dock_pharmacophore_soft_sim</option>
            <option value="mixed_hit">mixed_hit</option>
            <option value="dual_screen_soft_sim">dual_screen_soft_sim</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="model">Model hint</Label>
          <Input
            id="model"
            value={modelHint}
            onChange={(e) => setModelHint(e.target.value)}
            required
          />
          <Button type="submit">Create hit</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.modelHint} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default HitsPage;
