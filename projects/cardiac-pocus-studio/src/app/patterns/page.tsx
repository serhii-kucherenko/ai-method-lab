"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & { kind: string; modelHint: string; status: string };

export function PatternsPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [modelHint, setModelHint] = useState("cardiac-pocus-copd");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, rows] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Row[] }>(`/api/patterns?q=${encodeURIComponent(q)}`),
      ]);
      setPacks(p.items);
      setItems(rows.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/patterns", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "rv_strain_copd",
          modelHint,
          cardiacFloor: 0.45,
          associationFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Patterns"
      subtitle="Configure cardiac POCUS COPD patterns — RV strain, IVC collapse, LV underfill — before assay scoring."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Pattern label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="model">Model hint</Label>
          <Input id="model" value={modelHint} onChange={(e) => setModelHint(e.target.value)} required />
          <Button type="submit">Create pattern</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>Search</Button>
          </div>
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
      </div>
    </StudioShell>
  );
}

export default PatternsPage;
