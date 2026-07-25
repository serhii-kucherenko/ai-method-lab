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
  humanAi: { overall: number };
  aiOnly: { overall: number };
};

export function ComparePage() {
  const [reviewers, setReviewers] = useState<Ref[]>([]);
  const [labels, setLabels] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "Human–AI co-learning vs AI-only labeling baseline",
  );
  const [reviewerId, setReviewerId] = useState("");
  const [labelSetId, setLabelSetId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [r, s, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/reviewers"),
      api<{ items: Ref[] }>("/api/labels"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setReviewers(r.items);
    setLabels(s.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!reviewerId && r.items[0]) setReviewerId(r.items[0].id);
    if (!labelSetId && s.items[0]) setLabelSetId(s.items[0].id);
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
          reviewerId,
          labelSetId,
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
      subtitle="Dual A/B: human_ai_colearning_labeling vs ai_only_labeling_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="reviewer">Reviewer</Label>
          <select
            id="reviewer"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
          >
            {reviewers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="labelSet">Label set</Label>
          <select
            id="labelSet"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={labelSetId}
            onChange={(e) => setLabelSetId(e.target.value)}
          >
            {labels.map((m) => (
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
        <div className="md:col-span-2">
          <Button onClick={run}>Run compare</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--sc-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              winner {c.winner} · gap {c.gap} · human–AI {c.humanAi.overall} vs
              AI-only {c.aiOnly.overall}
            </p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-xs">Human–AI</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-full bg-[var(--sc-teal)]"
                    style={{ width: `${c.humanAi.overall}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs">AI-only</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-full bg-[var(--sc-amber)]"
                    style={{ width: `${c.aiOnly.overall}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
