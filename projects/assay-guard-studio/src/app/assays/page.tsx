"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Assay = {
  id: string;
  packId: string;
  label: string;
  ruleCount: number;
  rules: string[];
  assayWeight: number;
  status: string;
};

export default function AssaysPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Assay[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Volume and dwell assay rules");
  const [rules, setRules] = useState("Min tip volume, Max aspirate rate, Dwell time floor");
  const [assayWeight, setAssayWeight] = useState("0.62");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, a] = await Promise.all([
      api<{ items: Pack[] }>("/api/decks"),
      api<{ items: Assay[] }>(`/api/assays?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(a.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const ruleList = rules
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          rules: ruleList,
          ruleCount: ruleList.length,
          assayWeight: Number(assayWeight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Assay rules"
      subtitle="Encode assay constraints and assay vs runner weights before scoring."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search assays"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Deck pack</Label>
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
        <div>
          <Label htmlFor="rules">Rules (comma-separated)</Label>
          <Input
            id="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Assay weight</Label>
          <Input
            id="weight"
            value={assayWeight}
            onChange={(e) => setAssayWeight(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Define assay rules</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ag-amber)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((a) => (
          <li
            key={a.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{a.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {a.ruleCount} rules · weight {a.assayWeight} · {a.status}
            </div>
            <div className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
              {a.rules.join(" · ")}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
