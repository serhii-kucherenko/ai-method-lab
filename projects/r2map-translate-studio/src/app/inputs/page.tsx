"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type InputRow = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  sequenceHint: string;
  seriesCount: number;
  status: string;
};

export default function InputsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<InputRow[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Paired T1W/T2W series");
  const [sequenceHint, setSequenceHint] = useState(
    "t1w_fidelity,t2w_fidelity,gan_stability",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, c] = await Promise.all([
      api<{ items: Pack[] }>("/api/translates"),
      api<{ items: InputRow[] }>(`/api/inputs?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(c.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/inputs", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "paired_t1w_t2w",
          sequenceHint,
          seriesCount: 4,
          fidelityMin: 0.35,
          fidelityMax: 0.9,
          metricHint: "GAN T1W/T2W→R2map input soft-sim",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Inputs"
      subtitle="T1W/T2W input series — fidelity spans for GAN R2map translation."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search inputs"
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
          <Label htmlFor="seq">Sequence cues</Label>
          <Input
            id="seq"
            value={sequenceHint}
            onChange={(e) => setSequenceHint(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create input series</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.kind} · {c.sequenceHint} · series {c.seriesCount} · {c.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
