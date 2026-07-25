"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Scene = { id: string; label: string };
type Gen = {
  id: string;
  sceneId: string;
  fidelity: number;
  temporalConsistency: number;
  textureRichness: number;
  status: string;
  reviewerNotes: string;
};

export default function GeneratorsPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [items, setItems] = useState<Gen[]>([]);
  const [sceneId, setSceneId] = useState("");
  const [fidelity, setFidelity] = useState(0.75);
  const [temporalConsistency, setTemporalConsistency] = useState(0.7);
  const [textureRichness, setTextureRichness] = useState(0.72);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const sceneData = await api<{ items: Scene[] }>("/api/scenes");
    setScenes(sceneData.items);
    const sid = sceneId || sceneData.items[0]?.id || "";
    if (!sceneId && sid) setSceneId(sid);
    const gens = await api<{ items: Gen[] }>("/api/generators");
    setItems(gens.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const res = await api<{ generator: Gen | null }>("/api/generators", {
        method: "POST",
        body: JSON.stringify({
          sceneId,
          fidelity,
          temporalConsistency,
          textureRichness,
          reviewerNotes: notes,
        }),
      });
      if (!res.generator) {
        setError("Need a coarse scene first.");
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const ready = scenes.length > 0;

  return (
    <StudioShell
      title="Detail generators"
      subtitle="Tune fidelity, temporal consistency, and texture richness for hierarchical detail."
    >
      {!ready ? (
        <p className="text-sm text-slate-500">
          Need a coarse scene first — create one on Scenes.
        </p>
      ) : (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
          <div>
            <Label htmlFor="scene">Coarse scene</Label>
            <select
              id="scene"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
            >
              {scenes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="notes">Reviewer notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fit">Fidelity</Label>
            <Input
              id="fit"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={fidelity}
              onChange={(e) => setFidelity(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="temp">Temporal consistency</Label>
            <Input
              id="temp"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={temporalConsistency}
              onChange={(e) => setTemporalConsistency(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="tex">Texture richness</Label>
            <Input
              id="tex"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={textureRichness}
              onChange={(e) => setTextureRichness(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-3">
            <Button className="bg-[var(--studio-signal)]" onClick={create}>
              Create generator
            </Button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            fidelity {i.fidelity} · temporal {i.temporalConsistency} · texture{" "}
            {i.textureRichness} · {i.status}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
