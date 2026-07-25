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
  worldCognitive: { overall: number };
  singleLevel: { overall: number };
};

export default function ComparePage() {
  const [policies, setPolicies] = useState<Ref[]>([]);
  const [worlds, setWorlds] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("World-cognitive vs single-level");
  const [policyId, setPolicyId] = useState("");
  const [worldId, setWorldId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, w, r, c] = await Promise.all([
      api<{ items: Ref[] }>("/api/policies"),
      api<{ items: Ref[] }>("/api/worlds"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setPolicies(p.items);
    setWorlds(w.items);
    setRuns(r.items);
    setItems(c.items);
    if (!policyId && p.items[0]) setPolicyId(p.items[0].id);
    if (!worldId && w.items[0]) setWorldId(w.items[0].id);
    if (!runId && r.items[0]) setRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, policyId, worldId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual-level world-cognitive VLA (A) versus single-level VLA baseline (B)."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="policy">Policy</Label>
          <select
            id="policy"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label ?? p.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="world">World</Label>
          <select
            id="world"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={worldId}
            onChange={(e) => setWorldId(e.target.value)}
          >
            {worlds.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label ?? w.id}
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
        <div className="flex items-end">
          <Button onClick={run}>Run compare</Button>
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
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              winner {c.winner} · gap {c.gap} · A {c.worldCognitive.overall} ·
              B {c.singleLevel.overall}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-line)]">
              <div
                className="score-bar h-full bg-[var(--wc-amber)]"
                style={{ width: `${Math.min(100, c.worldCognitive.overall)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
