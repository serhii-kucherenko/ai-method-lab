"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Monitor = {
  id: string;
  packId?: string;
  label: string;
  monitorSummary: string;
  successCondition: string;
  monitorChannel: string;
  status: string;
};

export default function MonitorsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Monitor[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Runtime assay monitor ring");
  const [summary, setSummary] = useState(
    "Soft-sim assay-aware protocol validation vs naive protocol runner.",
  );
  const [condition, setCondition] = useState("lock_soft_sim");
  const [channel, setChannel] = useState("soft_sim_monitor");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, m] = await Promise.all([
      api<{ items: Pack[] }>("/api/decks"),
      api<{ items: Monitor[] }>(`/api/monitors?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(m.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/monitors", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          monitorSummary: summary,
          successCondition: condition,
          monitorChannel: channel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runtime monitors"
      subtitle="Configure soft-sim monitors and pack-lock success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search monitors"
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
        <div className="md:col-span-2">
          <Label htmlFor="summary">Monitor summary</Label>
          <Input
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="condition">Success condition</Label>
          <Input
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Monitor channel</Label>
          <Input
            id="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Configure monitor</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ag-amber)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{m.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {m.monitorChannel} · {m.successCondition} · {m.status}
            </div>
            <div className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
              {m.monitorSummary}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
