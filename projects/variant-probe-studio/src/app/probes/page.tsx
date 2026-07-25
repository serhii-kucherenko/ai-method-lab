"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Probe = {
  id: string;
  label: string;
  kind: string;
  embeddingAxis: string;
  interpretLayer: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function ProbesPage() {
  const [items, setItems] = useState<Probe[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Layer-12 FM embedding probe");
  const [embeddingAxis, setEmbeddingAxis] = useState(
    "splice_disruption,missense_severity",
  );
  const [interpretLayer, setInterpretLayer] = useState("layer_12_linear");
  const [error, setError] = useState("");

  async function load() {
    const [probes, pks] = await Promise.all([
      api<{ items: Probe[] }>(`/api/probes?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/panels"),
    ]);
    setItems(probes.items);
    setPacks(pks.items);
    if (!packId && pks.items[0]) setPackId(pks.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/probes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "embedding",
          embeddingAxis,
          interpretLayer,
          coverageMin: 0.4,
          coverageMax: 0.9,
          metricHint: "Interpretable probe AUROC (soft-sim)",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Probe configs"
      subtitle="Define embedding axes and interpret layers for soft-sim genomic FM probes."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search probes"
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
          <Label htmlFor="pack">Panel pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
          <Label htmlFor="axis">Embedding axis</Label>
          <Input
            id="axis"
            value={embeddingAxis}
            onChange={(e) => setEmbeddingAxis(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="layer">Interpret layer</Label>
          <Input
            id="layer"
            value={interpretLayer}
            onChange={(e) => setInterpretLayer(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create probe config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{m.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {m.kind} · {m.embeddingAxis} · {m.interpretLayer} · {m.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
