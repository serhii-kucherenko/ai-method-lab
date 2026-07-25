"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  unifiedInverse: { overall: number };
  naiveGenerative: { overall: number };
};

type Ref = { id: string; label?: string };

export default function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [designers, setDesigners] = useState<Ref[]>([]);
  const [targets, setTargets] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [name, setName] = useState("Unified inverse vs naive generative");
  const [designerId, setDesignerId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, des, tars, rs] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Ref[] }>("/api/designers"),
      api<{ items: Ref[] }>("/api/targets"),
      api<{ items: Ref[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setDesigners(des.items);
    setTargets(tars.items);
    setRuns(rs.items);
    if (!designerId && des.items[0]) setDesignerId(des.items[0].id);
    if (!targetId && tars.items[0]) setTargetId(tars.items[0].id);
    if (!runId && rs.items[0]) setRunId(rs.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, designerId, targetId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Unified inverse design (A) versus naive generative baseline (B)."
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
          <Label htmlFor="designer">Designer</Label>
          <select
            id="designer"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={designerId}
            onChange={(e) => setDesignerId(e.target.value)}
          >
            {designers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="target">Target</Label>
          <select
            id="target"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="mt-2 flex gap-4 text-sm">
              <span>
                A unified inverse {c.unifiedInverse.overall.toFixed(1)}
              </span>
              <span>
                B naive generative {c.naiveGenerative.overall.toFixed(1)}
              </span>
              <span className="text-[var(--pi-aqua)]">
                winner {c.winner} · gap {c.gap}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--pi-aqua)]"
                style={{
                  width: `${Math.min(100, c.unifiedInverse.overall)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
