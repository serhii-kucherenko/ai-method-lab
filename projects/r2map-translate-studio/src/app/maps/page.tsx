"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type MapRow = {
  id: string;
  label: string;
  mapText: string;
  successCondition: string;
  taskChannel: string;
  status: string;
};

export default function MapsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<MapRow[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("R2map soft-sim config");
  const [mapText, setMapText] = useState(
    "Generate soft-sim R2maps from T1W/T2W using GAN translation.",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, d] = await Promise.all([
      api<{ items: Pack[] }>("/api/translates"),
      api<{ items: MapRow[] }>(`/api/maps?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(d.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/maps", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          mapText,
          successCondition: "lock_soft_sim",
          taskChannel: "soft_sim_r2map_translate",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Maps"
      subtitle="R2map configs for translate soft-sim — not clinical diagnosis."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search maps"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Translate pack</Label>
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
        <div className="md:col-span-2">
          <Label htmlFor="text">Map text</Label>
          <Input
            id="text"
            value={mapText}
            onChange={(e) => setMapText(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create R2map config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((d) => (
          <li
            key={d.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{d.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {d.taskChannel} · {d.successCondition} · {d.status}
            </div>
            <p className="mt-1 text-sm">{d.mapText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
