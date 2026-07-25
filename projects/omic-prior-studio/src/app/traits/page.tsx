"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Trait = {
  id: string;
  label: string;
  panel: string;
  lockCondition: string;
  assayChannel: string;
  status: string;
};
type Pack = { id: string; label: string };

export function TraitsPage() {
  const [items, setItems] = useState<Trait[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("New complex trait panel");
  const [panel, setPanel] = useState("Priors-informed vs priors-free trait panel");
  const [error, setError] = useState("");

  async function load() {
    const [c, p] = await Promise.all([
      api<{ items: Trait[] }>(`/api/traits?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/omics"),
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
      await api("/api/traits", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          panel,
          lockCondition: "lock_soft_sim",
          assayChannel: "soft_sim_omic_prior_signal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Traits"
      subtitle="Register trait panels and lock conditions for soft-sim honesty."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search traits" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={() => load()}>Search</Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Omic pack</Label>
          <select id="pack" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="panel">Panel</Label>
          <Input id="panel" value={panel} onChange={(e) => setPanel(e.target.value)} />
        </div>
        <div><Button onClick={() => create()}>Register trait panel</Button></div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <p className="font-medium">{c.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.panel} · lock {c.lockCondition} · {c.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default TraitsPage;
