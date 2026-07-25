"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Quantification = {
  id: string;
  label: string;
  regionText: string;
  lockCondition: string;
  quantChannel: string;
  status: string;
};

export function QuantificationsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Quantification[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Hippocampus region quant");
  const [regionText, setRegionText] = useState(
    "Soft-sim region quantification against registered atlas pack.",
  );
  const [lockCondition, setLockCondition] = useState("lock_soft_sim");
  const [quantChannel, setQuantChannel] = useState("soft_sim_atlas_signal");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, qdata] = await Promise.all([
      api<{ items: Pack[] }>("/api/atlases"),
      api<{ items: Quantification[] }>(
        `/api/quantifications?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(qdata.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/quantifications", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          regionText,
          lockCondition,
          quantChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Quantifications"
      subtitle="Region quantification configs with lock conditions for soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search quantifications"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Atlas pack</Label>
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
          <Label htmlFor="lock">Lock condition</Label>
          <Input
            id="lock"
            value={lockCondition}
            onChange={(e) => setLockCondition(e.target.value)}
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
          <Label htmlFor="channel">Quant channel</Label>
          <Input
            id="channel"
            value={quantChannel}
            onChange={(e) => setQuantChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="region">Region text</Label>
          <Input
            id="region"
            value={regionText}
            onChange={(e) => setRegionText(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create quantification</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--af-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {item.quantChannel} · {item.lockCondition} · {item.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default QuantificationsPage;
