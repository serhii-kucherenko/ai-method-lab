"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Modality = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  channelHint: string;
  status: string;
};
type Pack = { id: string; label: string };

export default function ModalitiesPage() {
  const [items, setItems] = useState<Modality[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Hybrid multimodal chemistry channels");
  const [channelHint, setChannelHint] = useState(
    "multimodal_coverage,modality_fidelity,exemplar_alignment",
  );
  const [error, setError] = useState("");

  async function load() {
    const [s, p] = await Promise.all([
      api<{ items: Modality[] }>(
        `/api/modalities?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/discovers"),
    ]);
    setItems(s.items);
    setPacks(p.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
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
          kind: "hybrid_multimodal",
          channelHint,
          seriesCount: 4,
          fidelityMin: 0.4,
          fidelityMax: 0.9,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Modalities"
      subtitle="Multimodal chemistry channels linked to discover packs."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search modalities"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Discover pack</Label>
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
          <Label htmlFor="channel">Channel hint</Label>
          <Input
            id="channel"
            value={channelHint}
            onChange={(e) => setChannelHint(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create modality config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">
              {s.label} · {s.kind}
            </div>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.channelHint} · {s.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
