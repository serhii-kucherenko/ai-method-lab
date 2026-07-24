"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { QuadRobot, TerrainKind, TerrainMap } from "@/store";

const KINDS: TerrainKind[] = [
  "forest_floor",
  "rocky_slope",
  "mud_flat",
  "stairs",
  "rubble",
];

export default function TerrainsPage() {
  const [robots, setRobots] = useState<QuadRobot[]>([]);
  const [items, setItems] = useState<TerrainMap[]>([]);
  const [robotId, setRobotId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<TerrainKind>("rocky_slope");
  const [roughness, setRoughness] = useState("0.55");
  const [slopeGrade, setSlopeGrade] = useState("0.4");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [r, t] = await Promise.all([
      api<{ items: QuadRobot[] }>("/api/robots"),
      api<TerrainMap[]>(
        `/api/terrains?robotId=${encodeURIComponent(robotId)}&q=${encodeURIComponent(q)}`,
      ),
    ]);
    setRobots(r.items);
    if (!robotId && r.items[0]) setRobotId(r.items[0].id);
    setItems(Array.isArray(t) ? t : []);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!robotId) return;
    api<TerrainMap[]>(
      `/api/terrains?robotId=${encodeURIComponent(robotId)}&q=${encodeURIComponent(q)}`,
    )
      .then((t) => setItems(Array.isArray(t) ? t : []))
      .catch((e) => setError(String(e)));
  }, [robotId, q]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/terrains", {
        method: "POST",
        body: JSON.stringify({
          robotId,
          name,
          kind,
          roughness: Number(roughness),
          slopeGrade: Number(slopeGrade),
          notes: "Mapped from terrains page",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Terrain maps"
      subtitle="Library of wild trails — roughness and slope before the first skill switch."
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
          placeholder="Terrain name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value as TerrainKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <Input
          placeholder="Roughness 0–1"
          value={roughness}
          onChange={(e) => setRoughness(e.target.value)}
        />
        <Input
          placeholder="Slope 0–1"
          value={slopeGrade}
          onChange={(e) => setSlopeGrade(e.target.value)}
        />
        <Button type="submit">Add terrain</Button>
      </form>

      <Input
        className="mb-4"
        placeholder="Filter terrains"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium text-stone-900">{t.name}</div>
            <div className="mt-1 text-sm text-stone-500">
              {t.kind} · roughness {t.roughness.toFixed(2)} · slope{" "}
              {t.slopeGrade.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
