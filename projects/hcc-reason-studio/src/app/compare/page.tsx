"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  clinicalReasoning: { overall: number };
  nonReasoningBaseline: { overall: number };
};

export default function ComparePage() {
  const [reasoners, setReasoners] = useState<Entity[]>([]);
  const [schemas, setSchemas] = useState<Entity[]>([]);
  const [runs, setRuns] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Clinical-reasoning vs baseline compare");
  const [reasonerId, setReasonerId] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [r, s, runsData, cmp] = await Promise.all([
      api<{ items: Entity[] }>("/api/reasoners"),
      api<{ items: Entity[] }>("/api/schemas"),
      api<{ items: Entity[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setReasoners(r.items);
    setSchemas(s.items);
    setRuns(runsData.items);
    setItems(cmp.items);
    if (!reasonerId && r.items[0]) setReasonerId(r.items[0].id);
    if (!schemaId && s.items[0]) setSchemaId(s.items[0].id);
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
          reasonerId,
          schemaId,
          runId,
          bias: "balanced",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Clinical-reasoning LLM vs non-reasoning baseline."
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
          <Label htmlFor="reasoner">Reasoner</Label>
          <select
            id="reasoner"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={reasonerId}
            onChange={(e) => setReasonerId(e.target.value)}
          >
            {reasoners.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label ?? r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="schema">Schema</Label>
          <select
            id="schema"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={schemaId}
            onChange={(e) => setSchemaId(e.target.value)}
          >
            {schemas.map((s) => (
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
          <Button onClick={run}>Run compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--hr-wine)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  Clinical reasoning (A)
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--studio-mist)]">
                  <div
                    className="score-bar h-full bg-[var(--hr-wine)]"
                    style={{ width: `${c.clinicalReasoning.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.clinicalReasoning.overall}</div>
              </div>
              <div>
                <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  Non-reasoning baseline (B)
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--studio-mist)]">
                  <div
                    className="score-bar h-full bg-[var(--hr-gold)]"
                    style={{ width: `${c.nonReasoningBaseline.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">
                  {c.nonReasoningBaseline.overall}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm">
              Winner <strong>{c.winner}</strong> · gap {c.gap}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
