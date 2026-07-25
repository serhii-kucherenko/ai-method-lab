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
  gates: { overall: number };
  promptOnly: { overall: number };
};

export function ComparePage() {
  const [gates, setGates] = useState<Ref[]>([]);
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "Structured therapy-safety gates vs prompt-only safety baseline",
  );
  const [gateId, setGateId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [g, s, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/gates"),
      api<{ items: Ref[] }>("/api/scenarios"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setGates(g.items);
    setScenarios(s.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!gateId && g.items[0]) setGateId(g.items[0].id);
    if (!scenarioId && s.items[0]) setScenarioId(s.items[0].id);
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
        body: JSON.stringify({
          name,
          gateId,
          scenarioId,
          runId,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: structured_therapy_safety_gates vs prompt_only_safety_baseline."
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
          <Label htmlFor="gate">Gate</Label>
          <select
            id="gate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
          >
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label ?? g.id}
              </option>
            ))}
          </select>
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
          <Button onClick={run}>Run A/B compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · gates {c.gates.overall} vs
              prompt-only {c.promptOnly.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--tp-teal)]"
                style={{ width: `${Math.min(100, c.gates.overall)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
