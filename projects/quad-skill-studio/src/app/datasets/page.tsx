"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DatasetKind, QuadRobot, TrainingDataset } from "@/store";

const KINDS: DatasetKind[] = ["trajectory", "rl_rollout", "perception_pack"];

export default function DatasetsPage() {
  const [robots, setRobots] = useState<QuadRobot[]>([]);
  const [items, setItems] = useState<TrainingDataset[]>([]);
  const [robotId, setRobotId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<DatasetKind>("rl_rollout");
  const [density, setDensity] = useState("0.7");
  const [episodes, setEpisodes] = useState("1000");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: QuadRobot[] }>("/api/robots")
      .then(async (r) => {
        setRobots(r.items);
        const id = r.items[0]?.id ?? "";
        setRobotId(id);
        if (id) {
          const ds = await api<TrainingDataset[]>(
            `/api/datasets?robotId=${encodeURIComponent(id)}`,
          );
          setItems(Array.isArray(ds) ? ds : []);
        }
      })
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!robotId) return;
    api<TrainingDataset[]>(
      `/api/datasets?robotId=${encodeURIComponent(robotId)}`,
    )
      .then((ds) => setItems(Array.isArray(ds) ? ds : []))
      .catch((e) => setError(String(e)));
  }, [robotId]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/datasets", {
        method: "POST",
        body: JSON.stringify({
          robotId,
          name,
          kind,
          density: Number(density),
          episodes: Number(episodes),
          notes: "Curated from datasets page",
        }),
      });
      setName("");
      const ds = await api<TrainingDataset[]>(
        `/api/datasets?robotId=${encodeURIComponent(robotId)}`,
      );
      setItems(Array.isArray(ds) ? ds : []);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Training datasets"
      subtitle="Trajectory and RL packs that feed perceptive multi-skill plans."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={robotId}
          onChange={(e) => setRobotId(e.target.value)}
          required
        >
          {robots.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Dataset name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value as DatasetKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <Input
          placeholder="Density 0–1"
          value={density}
          onChange={(e) => setDensity(e.target.value)}
        />
        <Input
          placeholder="Episodes"
          value={episodes}
          onChange={(e) => setEpisodes(e.target.value)}
        />
        <Button type="submit">Add dataset</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((d) => (
          <li
            key={d.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium text-stone-900">{d.name}</div>
            <div className="mt-1 text-sm text-stone-500">
              {d.kind} · density {d.density.toFixed(2)} · {d.episodes} episodes
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
