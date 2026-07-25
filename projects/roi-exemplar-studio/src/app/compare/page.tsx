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
  optimizedIncontext: { overall: number };
  naiveBaseline: { overall: number };
};

export default function ComparePage() {
  const [prompts, setPrompts] = useState<Ref[]>([]);
  const [rois, setRois] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Optimized exemplars vs naive baseline");
  const [promptId, setPromptId] = useState("");
  const [roiId, setRoiId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, r, runsData, c] = await Promise.all([
      api<{ items: Ref[] }>("/api/prompts"),
      api<{ items: Ref[] }>("/api/rois"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setPrompts(p.items);
    setRois(r.items);
    setRuns(runsData.items);
    setItems(c.items);
    if (!promptId && p.items[0]) setPromptId(p.items[0].id);
    if (!roiId && r.items[0]) setRoiId(r.items[0].id);
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
        body: JSON.stringify({ name, promptId, roiId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: optimized_incontext_exemplars vs naive_exemplar_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="prompt">Prompt set</Label>
          <select
            id="prompt"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={promptId}
            onChange={(e) => setPromptId(e.target.value)}
          >
            {prompts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="roi">ROI config</Label>
          <select
            id="roi"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={roiId}
            onChange={(e) => setRoiId(e.target.value)}
          >
            {rois.map((m) => (
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
                  Optimized in-context (A)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--re-coral)]"
                    style={{ width: `${c.optimizedIncontext.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.optimizedIncontext.overall}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  Naive baseline (B)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--re-teal)]"
                    style={{ width: `${c.naiveBaseline.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.naiveBaseline.overall}</div>
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
