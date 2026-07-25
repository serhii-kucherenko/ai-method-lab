"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Persona = {
  id: string;
  packId: string;
  label: string;
  emotionalTag: string;
  strategyTag: string;
  verbosity: number;
  hedging: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function PersonaePage() {
  const [items, setItems] = useState<Persona[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [emotionalTag, setEmotionalTag] = useState("anxious");
  const [strategyTag, setStrategyTag] = useState("hedging");
  const [verbosity, setVerbosity] = useState(0.6);
  const [hedging, setHedging] = useState(0.7);
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Persona[] }>(
      `/api/personae?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    api<{ items: Pack[] }>("/api/packs")
      .then((d) => {
        setPacks(d.items);
        if (d.items[0]) setPackId(d.items[0].id);
      })
      .catch(() => undefined);
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/personae", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled persona",
          emotionalTag,
          strategyTag,
          verbosity,
          hedging,
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Personae"
      subtitle="Registry of communication personae for triage soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search label, emotion, or strategy"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
            {packs.length === 0 ? (
              <option value="pack-demo">pack-demo</option>
            ) : null}
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
          <Label htmlFor="emotion">Emotional tag</Label>
          <Input
            id="emotion"
            value={emotionalTag}
            onChange={(e) => setEmotionalTag(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="strategy">Strategy tag</Label>
          <Input
            id="strategy"
            value={strategyTag}
            onChange={(e) => setStrategyTag(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="verbosity">Verbosity (0–1)</Label>
          <Input
            id="verbosity"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={verbosity}
            onChange={(e) => setVerbosity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="hedging">Hedging (0–1)</Label>
          <Input
            id="hedging"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={hedging}
            onChange={(e) => setHedging(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create persona</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-coral)]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No personae yet — create the first persona above.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{p.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {p.emotionalTag} · {p.strategyTag} · verbosity {p.verbosity} ·
                hedging {p.hedging} · {p.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
