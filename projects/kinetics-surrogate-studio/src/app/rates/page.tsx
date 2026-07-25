"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type RateTable = {
  id: string;
  packId: string;
  label: string;
  reactionCount: number;
  species: string[];
  surrogateWeight: number;
  fullRateWeight: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function RatesPage() {
  const [items, setItems] = useState<RateTable[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [species, setSpecies] = useState("CH4,O2,CO2,H2O");
  const [reactionCount, setReactionCount] = useState("200");
  const [surrogateWeight, setSurrogateWeight] = useState("0.6");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: RateTable[] }>(
      `/api/rates?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    Promise.all([
      load(),
      api<{ items: Pack[] }>("/api/chemistry").then((d) => {
        setPacks(d.items);
        if (d.items[0]) setPackId(d.items[0].id);
      }),
    ]).catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/rates", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled rate table",
          species: species.split(",").map((s) => s.trim()).filter(Boolean),
          reactionCount: Number(reactionCount) || 0,
          surrogateWeight: Number(surrogateWeight) || 0.5,
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
      title="Rate tables"
      subtitle="Import and edit reaction counts, species lists, and surrogate vs full-rate weights."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search rates or species"
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
          <Label htmlFor="pack">Chemistry pack</Label>
          <select
            id="pack"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
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
          <Label htmlFor="species">Species (comma-separated)</Label>
          <Input
            id="species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="reactions">Reaction count</Label>
          <Input
            id="reactions"
            value={reactionCount}
            onChange={(e) => setReactionCount(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Surrogate weight</Label>
          <Input
            id="weight"
            value={surrogateWeight}
            onChange={(e) => setSurrogateWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create rate table</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No rate tables yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium">{r.label}</div>
              <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {r.reactionCount} reactions · surrogate {r.surrogateWeight} /
                full-rate {r.fullRateWeight} · {r.species.join(", ")} ·{" "}
                {r.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
