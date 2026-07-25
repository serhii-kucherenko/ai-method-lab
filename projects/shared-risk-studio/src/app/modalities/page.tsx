"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Modality = {
  id: string;
  label: string;
  kind: string;
  featureSet: string;
  timeWindow: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function ModalitiesPage() {
  const [items, setItems] = useState<Modality[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("EHR labs soft-sim schema");
  const [featureSet, setFeatureSet] = useState("labs,vitals");
  const [timeWindow, setTimeWindow] = useState("5y_rolling");
  const [error, setError] = useState("");

  async function load() {
    const [mods, pks] = await Promise.all([
      api<{ items: Modality[] }>(
        `/api/modalities?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/cohorts"),
    ]);
    setItems(mods.items);
    setPacks(pks.items);
    if (!packId && pks.items[0]) setPackId(pks.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/modalities", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "ehr",
          featureSet,
          timeWindow,
          coverageMin: 0.4,
          coverageMax: 0.9,
          metricHint: "Shared risk AUROC (soft-sim)",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Modality schemas"
      subtitle="Define feature sets and time windows for soft-sim shared representations."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search modalities"
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
          <Label htmlFor="pack">Cohort pack</Label>
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
          <Label htmlFor="features">Feature set</Label>
          <Input
            id="features"
            value={featureSet}
            onChange={(e) => setFeatureSet(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="window">Time window</Label>
          <Input
            id="window"
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create modality schema</Button>
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
              {m.kind} · {m.featureSet} · {m.timeWindow} · {m.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
