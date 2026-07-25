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
  governed: { overall: number };
  ungated: { overall: number };
};

export default function ComparePage() {
  const [workflows, setWorkflows] = useState<Ref[]>([]);
  const [gates, setGates] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Governed vs ungated agent");
  const [workflowId, setWorkflowId] = useState("");
  const [gateId, setGateId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, w, r, c] = await Promise.all([
      api<{ items: Ref[] }>("/api/workflows"),
      api<{ items: Ref[] }>("/api/gates"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setWorkflows(p.items);
    setGates(w.items);
    setRuns(r.items);
    setItems(c.items);
    if (!workflowId && p.items[0]) setWorkflowId(p.items[0].id);
    if (!gateId && w.items[0]) setGateId(w.items[0].id);
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
        body: JSON.stringify({ name, workflowId, gateId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Governed end-to-end research (A) versus ungated agent baseline (B)."
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
          <Label htmlFor="workflow">Workflow</Label>
          <select
            id="workflow"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={workflowId}
            onChange={(e) => setWorkflowId(e.target.value)}
          >
            {workflows.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label ?? p.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gate">Gate</Label>
          <select
            id="gate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
          >
            {gates.map((w) => (
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
              winner {c.winner} · gap {c.gap} · A {c.governed.overall} · B{" "}
              {c.ungated.overall}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-line)]">
              <div
                className="score-bar h-full bg-[var(--gr-brass)]"
                style={{ width: `${Math.min(100, c.governed.overall)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
