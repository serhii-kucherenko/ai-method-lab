"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DesignBrief, MaterialKind, MaterialSequence } from "@/store";

const MATS: MaterialKind[] = [
  "SiO2",
  "TiO2",
  "Ta2O5",
  "MgF2",
  "Al2O3",
  "Nb2O5",
  "custom",
];

export default function MaterialsPage() {
  const [items, setItems] = useState<MaterialSequence[]>([]);
  const [briefs, setBriefs] = useState<DesignBrief[]>([]);
  const [briefId, setBriefId] = useState("");
  const [name, setName] = useState("");
  const [material, setMaterial] = useState<MaterialKind>("SiO2");
  const [diversity, setDiversity] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [seq, br] = await Promise.all([
      api<{ items: MaterialSequence[] }>("/api/materials"),
      api<{ items: DesignBrief[] }>("/api/briefs"),
    ]);
    setItems(seq.items);
    setBriefs(br.items);
    if (!briefId && br.items[0]) setBriefId(br.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/materials", {
        method: "POST",
        body: JSON.stringify({
          briefId,
          name,
          materials: [material, "TiO2", material, "TiO2"],
          diversity: Number(diversity),
          notes: "Discrete material sequence proposal",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Material sequences"
      subtitle="Discrete material proposals for open-vocabulary stacks — not catalog-locked only."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={briefId}
          onChange={(e) => setBriefId(e.target.value)}
          required
        >
          {briefs.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Sequence name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={material}
          onChange={(e) => setMaterial(e.target.value as MaterialKind)}
        >
          {MATS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Diversity"
          value={diversity}
          onChange={(e) => setDiversity(e.target.value)}
        />
        <Button type="submit" className="md:col-span-4 md:w-fit">
          Propose sequence
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="animate-layer-peel rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="text-xs text-slate-500">
                diversity {Math.round(c.diversity * 100)}%
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-slate-600">
              {c.materials.join(" → ")}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
