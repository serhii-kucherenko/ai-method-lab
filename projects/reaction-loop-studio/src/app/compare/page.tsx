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
  chemistInLoop: { overall: number };
  openLoop: { overall: number };
};

type Ref = { id: string; label?: string };

export default function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [loops, setLoops] = useState<Ref[]>([]);
  const [reagents, setReagents] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [name, setName] = useState("Chemist-in-loop vs open-loop VLM");
  const [loopId, setLoopId] = useState("");
  const [reagentId, setReagentId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, lps, rgs, rs] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Ref[] }>("/api/loops"),
      api<{ items: Ref[] }>("/api/reagents"),
      api<{ items: Ref[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setLoops(lps.items);
    setReagents(rgs.items);
    setRuns(rs.items);
    if (!loopId && lps.items[0]) setLoopId(lps.items[0].id);
    if (!reagentId && rgs.items[0]) setReagentId(rgs.items[0].id);
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
        body: JSON.stringify({ name, loopId, reagentId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Chemist-in-the-loop VLM (A) versus open-loop VLM baseline (B)."
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
          <Label htmlFor="loop">Loop policy</Label>
          <select
            id="loop"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={loopId}
            onChange={(e) => setLoopId(e.target.value)}
          >
            {loops.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="reagent">Reagent space</Label>
          <select
            id="reagent"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={reagentId}
            onChange={(e) => setReagentId(e.target.value)}
          >
            {reagents.map((s) => (
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
                A chemist-in-loop {c.chemistInLoop.overall.toFixed(1)}
              </span>
              <span>B open-loop {c.openLoop.overall.toFixed(1)}</span>
              <span className="text-[var(--rl-teal)]">
                winner {c.winner} · gap {c.gap}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--rl-teal)]"
                style={{
                  width: `${Math.min(100, c.chemistInLoop.overall)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
