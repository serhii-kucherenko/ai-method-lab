"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Skeleton = {
  id: string;
  packId: string;
  label: string;
  nodeCount: number;
  nodes: string[];
  scaffoldWeight: number;
  status: string;
};

export default function SkeletonsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Skeleton[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Branching nav skeleton");
  const [nodes, setNodes] = useState("Root, Region, Metric, Leaf");
  const [scaffoldWeight, setScaffoldWeight] = useState("0.65");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/experiences"),
      api<{ items: Skeleton[] }>(
        `/api/skeletons?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(s.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const nodeList = nodes
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      await api("/api/skeletons", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          nodes: nodeList,
          nodeCount: nodeList.length,
          scaffoldWeight: Number(scaffoldWeight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Navigation skeletons"
      subtitle="Author hierarchical paths and scaffold vs linear weights before locking."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search skeletons"
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
          <Label htmlFor="pack">Experience pack</Label>
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
          <Label htmlFor="skel-label">Label</Label>
          <Input
            id="skel-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="nodes">Nodes (comma-separated)</Label>
          <Input
            id="nodes"
            value={nodes}
            onChange={(e) => setNodes(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Scaffold weight</Label>
          <Input
            id="weight"
            value={scaffoldWeight}
            onChange={(e) => setScaffoldWeight(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create skeleton</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.nodeCount} nodes · scaffold {s.scaffoldWeight} · {s.status}
            </div>
            <div className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
              {s.nodes.join(" → ")}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
