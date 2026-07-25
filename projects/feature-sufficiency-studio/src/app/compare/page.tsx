"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Cohort = { id: string; label: string };
type Mask = { id: string; label: string };
type Run = { id: string; caseId: string; maskId: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  partialObservation: { overall: number };
  fullFeature: { overall: number };
};

export default function ComparePage() {
  const [cases, setCases] = useState<Cohort[]>([]);
  const [masks, setMasks] = useState<Mask[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [caseId, setCaseId] = useState("");
  const [maskId, setMaskId] = useState("");
  const [sufficiencyRunId, setSufficiencyRunId] = useState("");
  const [name, setName] = useState("Partial vs full-feature");
  const [last, setLast] = useState<Compare | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [c, m, r, cmp] = await Promise.all([
      api<{ items: Cohort[] }>("/api/cohorts"),
      api<{ items: Mask[] }>("/api/masks"),
      api<{ items: Run[] }>("/api/sufficiency"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setCases(c.items);
    setMasks(m.items);
    setRuns(r.items);
    setCompares(cmp.items);
    if (!caseId && c.items[0]) setCaseId(c.items[0].id);
    if (!maskId && m.items[0]) setMaskId(m.items[0].id);
    if (!sufficiencyRunId && r.items[0]) setSufficiencyRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      const data = await api<{ compare: Compare }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          caseId,
          maskId,
          sufficiencyRunId,
          sufficiencyBias: "balanced",
        }),
      });
      setLast(data.compare);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Partial-observation sufficiency (A) vs full-feature baseline (B)."
    >
      {!runs.length ? (
        <p className="mb-6 text-slate-500">
          Need a sufficiency run — create one on /sufficiency first.
        </p>
      ) : null}
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
          <Label htmlFor="case">Cohort case</Label>
          <select
            id="case"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="mask">Observation mask</Label>
          <select
            id="mask"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={maskId}
            onChange={(e) => setMaskId(e.target.value)}
          >
            {masks.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Sufficiency run</Label>
          <select
            id="run"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={sufficiencyRunId}
            onChange={(e) => setSufficiencyRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {last ? (
        <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <div className="font-medium text-slate-900">Latest delta</div>
          <p className="mt-2 text-sm text-slate-600">
            Partial {last.partialObservation.overall} vs Full{" "}
            {last.fullFeature.overall} · winner {last.winner} · gap {last.gap}
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">Partial observation</div>
              <div
                className="score-bar mt-1 h-2 rounded bg-[var(--studio-teal)]"
                style={{ width: `${last.partialObservation.overall}%` }}
              />
            </div>
            <div>
              <div className="text-xs text-slate-500">Full-feature baseline</div>
              <div
                className="score-bar mt-1 h-2 rounded bg-[var(--studio-warn)]"
                style={{ width: `${last.fullFeature.overall}%` }}
              />
            </div>
          </div>
        </div>
      ) : null}
      {compares.length === 0 ? (
        <p className="text-slate-500">No compares yet.</p>
      ) : (
        <ul className="space-y-2">
          {compares.map((c) => (
            <li
              key={c.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-1 text-sm text-slate-500">
                Partial {c.partialObservation.overall} · Full{" "}
                {c.fullFeature.overall} · {c.winner} · gap {c.gap}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
