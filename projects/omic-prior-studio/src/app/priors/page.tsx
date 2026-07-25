"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Prior = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  priorHint: string;
  caseCount: number;
  status: string;
};
type Pack = { id: string; label: string };

export function PriorsPage() {
  const [items, setItems] = useState<Prior[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("New pathway prior set");
  const [kind, setKind] = useState("pathway_graph");
  const [error, setError] = useState("");

  async function load() {
    const [t, p] = await Promise.all([
      api<{ items: Prior[] }>(`/api/priors?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/omics"),
    ]);
    setItems(t.items);
    setPacks(p.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/priors", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          priorHint: "prior_coverage,trait_grounding",
          caseCount: 3,
          hardnessMin: 0.3,
          hardnessMax: 0.9,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Priors"
      subtitle="Configure statistical prior sets for priors-informed transformer soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search priors" value={q} onChange={(e) => setQ(e.target.value)} />
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
          <Label htmlFor="kind">Kind</Label>
          <select id="kind" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            {["pathway_graph", "eqtl_panel", "disease_gwas", "custom"].map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div><Button onClick={() => create()}>Create prior set</Button></div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((t) => (
          <li key={t.id} className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <p className="font-medium">{t.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {t.kind} · cases {t.caseCount} · {t.priorHint} · {t.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default PriorsPage;
