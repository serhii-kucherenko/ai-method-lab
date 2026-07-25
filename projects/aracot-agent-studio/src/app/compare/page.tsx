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
  distilledAgent: { overall: number };
  nondistilledBaseline: { overall: number };
};

export default function ComparePage() {
  const [distills, setDistills] = useState<Ref[]>([]);
  const [traces, setTraces] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "Arabic CoT distilled vs non-distilled multilingual baseline",
  );
  const [distillId, setDistillId] = useState("");
  const [traceId, setTraceId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [d, c, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/distills"),
      api<{ items: Ref[] }>("/api/traces"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setDistills(d.items);
    setTraces(c.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!distillId && d.items[0]) setDistillId(d.items[0].id);
    if (!traceId && c.items[0]) setTraceId(c.items[0].id);
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
        body: JSON.stringify({ name, distillId, traceId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: arabic_cot_distilled_agent vs nondistilled_multilingual_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="distill">Distill config</Label>
          <select
            id="distill"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={distillId}
            onChange={(e) => setDistillId(e.target.value)}
          >
            {distills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="trace">Trace set</Label>
          <select
            id="trace"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={traceId}
            onChange={(e) => setTraceId(e.target.value)}
          >
            {traces.map((m) => (
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
            <p className="mt-1 text-sm">
              A {c.distilledAgent.overall} · B {c.nondistilledBaseline.overall} ·
              winner {c.winner} · gap {c.gap}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
