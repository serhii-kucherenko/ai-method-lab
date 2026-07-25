"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  mapId: string;
  inputId: string;
  t1wFidelity: number;
  t2wFidelity: number;
  ganStability: number;
  mapCoherence: number;
  status: string;
};

export default function RunsPage() {
  const [maps, setMaps] = useState<Ref[]>([]);
  const [inputs, setInputs] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [mapId, setMapId] = useState("");
  const [inputId, setInputId] = useState("");
  const [t1wFidelity, setT1wFidelity] = useState(0.6);
  const [t2wFidelity, setT2wFidelity] = useState(0.65);
  const [ganStability, setGanStability] = useState(0.7);
  const [mapCoherence, setMapCoherence] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [d, c, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/maps"),
      api<{ items: Ref[] }>("/api/inputs"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setMaps(d.items);
    setInputs(c.items);
    setItems(r.items);
    if (!mapId && d.items[0]) setMapId(d.items[0].id);
    if (!inputId && c.items[0]) setInputId(c.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          mapId,
          inputId,
          t1wFidelity,
          t2wFidelity,
          ganStability,
          mapCoherence,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Soft-sim translate runs — T1W/T2W fidelity, GAN stability, map coherence."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
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
          <Label htmlFor="t1">T1W fidelity</Label>
          <Input
            id="t1"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={t1wFidelity}
            onChange={(e) => setT1wFidelity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="t2">T2W fidelity</Label>
          <Input
            id="t2"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={t2wFidelity}
            onChange={(e) => setT2wFidelity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="gan">GAN stability</Label>
          <Input
            id="gan"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={ganStability}
            onChange={(e) => setGanStability(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="mapc">Map coherence</Label>
          <Input
            id="mapc"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={mapCoherence}
            onChange={(e) => setMapCoherence(Number(e.target.value))}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              T1W {r.t1wFidelity} · T2W {r.t2wFidelity} · GAN {r.ganStability} ·
              map {r.mapCoherence} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
