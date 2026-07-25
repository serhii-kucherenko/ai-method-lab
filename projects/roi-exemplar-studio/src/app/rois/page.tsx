"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Roi = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  cues: string;
  cueCount: number;
  coverageMin: number;
  coverageMax: number;
  status: string;
};

export default function RoisPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Roi[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Multi-lesion ROI cue set");
  const [kind, setKind] = useState("multi_lesion");
  const [cues, setCues] = useState("localization,coverage,diversity");
  const [error, setError] = useState("");

  async function load() {
    const [p, r] = await Promise.all([
      api<{ items: Pack[] }>("/api/exemplars"),
      api<{ items: Roi[] }>(`/api/rois?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(r.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/rois", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          cues,
          cueCount: cues.split(",").filter(Boolean).length,
          coverageMin: 0.35,
          coverageMax: 0.92,
          metricHint: "Optimized in-context ROI cues",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="ROI configs"
      subtitle="Region-of-interest cue sets linked to exemplar packs — soft-sim localization only."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search ROIs"
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
          <Label htmlFor="pack">Exemplar pack</Label>
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
        <div>
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="focal">focal</option>
            <option value="bounding">bounding</option>
            <option value="mask">mask</option>
            <option value="multi_lesion">multi_lesion</option>
            <option value="mixed">mixed</option>
          </select>
        </div>
        <div>
          <Label htmlFor="cues">Cues</Label>
          <Input
            id="cues"
            value={cues}
            onChange={(e) => setCues(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create ROI config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {r.kind} · {r.cues} · coverage {r.coverageMin}–{r.coverageMax} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
