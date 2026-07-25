"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Inpaint = {
  id: string;
  packId?: string;
  label: string;
  recipe: string;
  lockCondition: string;
  signalChannel: string;
  status: string;
};

export function InpaintsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Inpaint[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Segment gap inpaint recipe");
  const [recipe, setRecipe] = useState("PPG-guided soft-sim recipe");
  const [lockCondition, setLockCondition] = useState("lock_soft_sim");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, inpaints] = await Promise.all([
      api<{ items: Pack[] }>("/api/ecgs"),
      api<{ items: Inpaint[] }>(
        `/api/inpaints?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(inpaints.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/inpaints", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          recipe,
          lockCondition,
          signalChannel: "soft_sim_nicu_ecg_signal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/inpaints", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Inpaints"
      subtitle="Inpaint recipes and lock conditions for neonatal ECG soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search inpaints"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Ecg pack</Label>
          <select
            id="pack"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
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
          <Label htmlFor="lock">Lock condition</Label>
          <select
            id="lock"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={lockCondition}
            onChange={(e) => setLockCondition(e.target.value)}
          >
            <option value="hold_pack">hold_pack</option>
            <option value="review">review</option>
            <option value="lock_soft_sim">lock_soft_sim</option>
            <option value="strong_lock">strong_lock</option>
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="recipe">Recipe</Label>
          <Input id="recipe" value={recipe} onChange={(e) => setRecipe(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>Create inpaint recipe</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{c.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {c.recipe} · {c.lockCondition} · {c.signalChannel} · {c.status}
              </p>
            </div>
            {c.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(c.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default InpaintsPage;
