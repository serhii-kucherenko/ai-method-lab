"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type CoarseScene = {
  id: string;
  label: string;
  corridor: string;
  structureFit: number;
  horizonSteps: number;
  status: string;
  notes: string;
};

export default function ScenesPage() {
  const [items, setItems] = useState<CoarseScene[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [corridor, setCorridor] = useState("urban");
  const [structureFit, setStructureFit] = useState(0.7);
  const [horizonSteps, setHorizonSteps] = useState(12);
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: CoarseScene[] }>(
      `/api/scenes?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/scenes", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled coarse scene",
          corridor,
          structureHash: `sh-${Date.now()}`,
          horizonSteps,
          structureFit,
          notes: "",
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
      title="Coarse scenes"
      subtitle="Structure board for hierarchical world-model horizons."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search corridor or label"
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
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="corridor">Corridor</Label>
          <Input
            id="corridor"
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fit">Structure fit (0–1)</Label>
          <Input
            id="fit"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={structureFit}
            onChange={(e) => setStructureFit(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="steps">Horizon steps</Label>
          <Input
            id="steps"
            type="number"
            min={1}
            max={64}
            value={horizonSteps}
            onChange={(e) => setHorizonSteps(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end md:col-span-4">
          <Button className="bg-[var(--studio-signal)]" onClick={create}>
            Create scene
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No scenes yet — create the first coarse scene above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.label}</div>
              <div className="text-sm text-slate-500">
                {c.corridor} · fit {c.structureFit} · {c.horizonSteps} steps ·{" "}
                {c.status}
              </div>
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
