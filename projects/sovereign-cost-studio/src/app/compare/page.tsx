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
  sovereignWee: { overall: number };
  naiveCloud: { overall: number };
};

export default function ComparePage() {
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [models, setModels] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Sovereign W/E/E vs naive cloud");
  const [scenarioId, setScenarioId] = useState("");
  const [modelId, setModelId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, m, r, c] = await Promise.all([
      api<{ items: Ref[] }>("/api/scenarios"),
      api<{ items: Ref[] }>("/api/models"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setScenarios(s.items);
    setModels(m.items);
    setRuns(r.items);
    setItems(c.items);
    if (!scenarioId && s.items[0]) setScenarioId(s.items[0].id);
    if (!modelId && m.items[0]) setModelId(m.items[0].id);
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
        body: JSON.stringify({ name, scenarioId, modelId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: sovereign_infra_wee_accounting vs naive_cloud_footprint_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="scenario">Scenario</Label>
          <select
            id="scenario"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <select
            id="model"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
          >
            {models.map((m) => (
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
                  Sovereign W/E/E (A)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--sc-teal)]"
                    style={{ width: `${c.sovereignWee.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.sovereignWee.overall}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  Naive cloud (B)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--sc-amber)]"
                    style={{ width: `${c.naiveCloud.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.naiveCloud.overall}</div>
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
