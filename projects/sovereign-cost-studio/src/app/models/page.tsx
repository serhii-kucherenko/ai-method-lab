"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Model = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  factors: string;
  factorCount: number;
  status: string;
};

export default function ModelsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Model[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Hydro + grid hybrid W/E/E gate");
  const [factors, setFactors] = useState("water,energy,emissions,cooling");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, m] = await Promise.all([
      api<{ items: Pack[] }>("/api/costs"),
      api<{ items: Model[] }>(`/api/models?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(m.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/models", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "hybrid",
          factors,
          factorCount: factors.split(",").filter(Boolean).length,
          coverageMin: 0.4,
          coverageMax: 0.9,
          metricHint: "Sovereign-infra W/E/E soft-sim",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Impact models"
      subtitle="Configure water–energy–emissions models for sovereign AI infrastructure soft-sim scoring."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search models"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => load().catch((e) => setError(String(e)))}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Cost pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="factors">Factors</Label>
          <Input id="factors" value={factors} onChange={(e) => setFactors(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Create model</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{m.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {m.kind} · {m.factors} · {m.factorCount} factors · {m.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
