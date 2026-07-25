"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  ganTranslation: { overall: number };
  conventionalBaseline: { overall: number };
};

export default function ComparePage() {
  const [maps, setMaps] = useState<Ref[]>([]);
  const [inputs, setInputs] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "GAN R2map translation vs conventional R2 baseline",
  );
  const [mapId, setMapId] = useState("");
  const [inputId, setInputId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [d, c, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/maps"),
      api<{ items: Ref[] }>("/api/inputs"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setMaps(d.items);
    setInputs(c.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!mapId && d.items[0]) setMapId(d.items[0].id);
    if (!inputId && c.items[0]) setInputId(c.items[0].id);
    if (!runId && runsData.items[0]) setRunId(runsData.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, mapId, inputId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: gan_r2map_translation vs conventional_r2_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="map">R2map config</Label>
          <select
            id="map"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={mapId}
            onChange={(e) => setMapId(e.target.value)}
          >
            {maps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="input">Input series</Label>
          <select
            id="input"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          >
            {inputs.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label ?? m.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button onClick={run}>Run A/B compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  GAN R2map translation (A)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--r2-teal)]"
                    style={{ width: `${c.ganTranslation.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.ganTranslation.overall}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  Conventional R2 baseline (B)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--r2-amber)]"
                    style={{ width: `${c.conventionalBaseline.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.conventionalBaseline.overall}</div>
              </div>
            </div>
            <p className="mt-2 text-sm">
              Winner: {c.winner} · gap {c.gap}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
