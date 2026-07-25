"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compound = {
  id: string;
  label: string;
  library: string;
  lockCondition: string;
  assayChannel: string;
  status: string;
};
type Pack = { id: string; label: string };

export function CompoundsPage() {
  const [items, setItems] = useState<Compound[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("New hit compound set");
  const [library, setLibrary] = useState("Structured vs naive docking library");
  const [error, setError] = useState("");

  async function load() {
    const [c, p] = await Promise.all([
      api<{ items: Compound[] }>(`/api/compounds?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/hits"),
    ]);
    setItems(c.items);
    setPacks(p.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/compounds", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          library,
          lockCondition: "lock_soft_sim",
          assayChannel: "soft_sim_hit_finding_signal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compounds"
      subtitle="Register compound sets and lock conditions for soft-sim honesty."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search compounds" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={() => load()}>Search</Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Hit pack</Label>
          <select id="pack" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="lib">Library</Label>
          <Input id="lib" value={library} onChange={(e) => setLibrary(e.target.value)} />
        </div>
        <div><Button onClick={() => create()}>Register compounds</Button></div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <p className="font-medium">{c.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.library} · lock {c.lockCondition} · {c.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default CompoundsPage;
