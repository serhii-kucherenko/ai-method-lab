"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & { kind: string; status: string; modelHint?: string };

const KINDS = [
  "culture_confirmed_shigella",
  "pcr_confirmed_shigella",
  "clinical_diarrhea",
  "bloody_diarrhea",
  "custom",
] as const;

export function EpisodesPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("culture_confirmed_shigella");
  const [modelHint, setModelHint] = useState("abx-treated-shigella");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, e] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Row[] }>("/api/episodes"),
      ]);
      setPacks(p.items);
      setItems(e.items);
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
      await api("/api/episodes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          modelHint,
          antibioticFloor: 0.4,
          confirmationFloor: 0.35,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Episodes"
      subtitle="Configure Shigella confirmation and antibiotic floors for episode soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label>Kind</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <Label htmlFor="model">Model hint</Label>
          <Input id="model" value={modelHint} onChange={(e) => setModelHint(e.target.value)} required />
          <Button type="submit">Create episode</Button>
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

export default EpisodesPage;
