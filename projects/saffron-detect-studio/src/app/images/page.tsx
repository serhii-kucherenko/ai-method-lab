"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Image = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  status: string;
  seriesCount: number;
};

export function ImagesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Image[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("New stigma-image series");
  const [error, setError] = useState("");

  async function load() {
    const [p, imgs] = await Promise.all([
      api<{ items: Pack[] }>("/api/detects"),
      api<{ items: Image[] }>(`/api/images?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(imgs.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/images", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "stigma_macro",
          channelHint:
            "stigma_clarity,adulterant_contrast,cnn_confidence,texture_integrity",
          seriesCount: 3,
          clarityMin: 0.4,
          clarityMax: 0.9,
          metricHint: "Soft-sim stigma clarity and adulterant contrast",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/images", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Images"
      subtitle="Stigma-image labeling workspace for authenticity soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search images"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Detect pack</Label>
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
          <Button onClick={create}>Register stigma images</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((img) => (
          <li
            key={img.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{img.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {img.kind} · series {img.seriesCount} · {img.status}
              </p>
            </div>
            {img.status !== "archived" ? (
              <Button variant="outline" onClick={() => archive(img.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ImagesPage;
