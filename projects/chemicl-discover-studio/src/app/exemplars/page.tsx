"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Exemplar = {
  id: string;
  label: string;
  exemplarText: string;
  chemistryChannel: string;
  status: string;
};
type Pack = { id: string; label: string };

export default function ExemplarsPage() {
  const [items, setItems] = useState<Exemplar[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Multimodal chemistry exemplar set");
  const [exemplarText, setExemplarText] = useState(
    "Run ChemICL soft-sim with structure, spectrum, and scheme context.",
  );
  const [error, setError] = useState("");

  async function load() {
    const [t, p] = await Promise.all([
      api<{ items: Exemplar[] }>(`/api/exemplars?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/discovers"),
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
      await api("/api/exemplars", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          exemplarText,
          successCondition: "lock_soft_sim",
          chemistryChannel: "soft_sim_chemicl_multimodal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Exemplars"
      subtitle="Multimodal exemplar sets for ChemICL soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search exemplars"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Discover pack</Label>
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
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="text">Exemplar text</Label>
          <Input
            id="text"
            value={exemplarText}
            onChange={(e) => setExemplarText(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create exemplar set</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{t.label}</div>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.exemplarText} · {t.chemistryChannel} · {t.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
