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
  scaffoldedAuthoring: { overall: number };
  naiveLinear: { overall: number };
};

export default function ComparePage() {
  const [labels, setLabels] = useState<Ref[]>([]);
  const [skeletons, setSkeletons] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Scaffolded vs naive linear");
  const [labelId, setLabelId] = useState("");
  const [skeletonId, setSkeletonId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [l, s, r, c] = await Promise.all([
      api<{ items: Ref[] }>("/api/labels"),
      api<{ items: Ref[] }>("/api/skeletons"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setLabels(l.items);
    setSkeletons(s.items);
    setRuns(r.items);
    setItems(c.items);
    if (!labelId && l.items[0]) setLabelId(l.items[0].id);
    if (!skeletonId && s.items[0]) setSkeletonId(s.items[0].id);
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
        body: JSON.stringify({ name, labelId, skeletonId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Scaffolded visual authoring (A) versus naive linear baseline (B)."
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
          <Label htmlFor="label">Label</Label>
          <select
            id="label"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
          >
            {labels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label ?? l.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="skel">Skeleton</Label>
          <select
            id="skel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={skeletonId}
            onChange={(e) => setSkeletonId(e.target.value)}
          >
            {skeletons.map((s) => (
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
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
                  Scaffolded (A)
                </div>
                <div className="h-2 overflow-hidden rounded bg-[var(--studio-line)]">
                  <div
                    className="score-bar h-full bg-[var(--sa-lime)]"
                    style={{ width: `${c.scaffoldedAuthoring.overall}%` }}
                  />
                </div>
                <div className="text-sm">{c.scaffoldedAuthoring.overall}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
                  Naive linear (B)
                </div>
                <div className="h-2 overflow-hidden rounded bg-[var(--studio-line)]">
                  <div
                    className="score-bar h-full bg-[var(--sa-blue)]"
                    style={{ width: `${c.naiveLinear.overall}%` }}
                  />
                </div>
                <div className="text-sm">{c.naiveLinear.overall}</div>
              </div>
            </div>
            <div className="mt-2 text-sm">
              Winner: {c.winner} · gap {c.gap}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
