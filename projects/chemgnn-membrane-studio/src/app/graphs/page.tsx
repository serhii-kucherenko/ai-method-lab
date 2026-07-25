"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Graph = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  channelHint: string;
  status: string;
};

export default function GraphsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Graph[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Aligned CNT bundle graph");
  const [kind, setKind] = useState("aligned_cnt");
  const [channelHint, setChannelHint] = useState(
    "graph_coverage,pore_geometry_fidelity,salt_rejection,water_flux",
  );
  const [error, setError] = useState("");

  async function load() {
    const [p, g] = await Promise.all([
      api<{ items: Pack[] }>("/api/membranes"),
      api<{ items: Graph[] }>(`/api/graphs?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(g.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/graphs", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          channelHint,
          seriesCount: 4,
          fidelityMin: 0.4,
          fidelityMax: 0.9,
          metricHint: "CNT pore / chirality soft-sim channels",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/graphs", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Graphs"
      subtitle="CNT graph configs — chirality, pore geometry, and channel fidelity."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search graphs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Membrane pack</Label>
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
          <Label htmlFor="kind">Kind</Label>
          <Input
            id="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
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
          <Label htmlFor="channels">Channel hint</Label>
          <Input
            id="channels"
            value={channelHint}
            onChange={(e) => setChannelHint(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create graph</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((g) => (
          <li
            key={g.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <div className="font-medium">
                {g.label} · {g.kind}
              </div>
              <p className="text-sm">{g.channelHint} · {g.status}</p>
            </div>
            {g.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(g.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
