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
  targetTrial: { overall: number };
  spontaneous: { overall: number };
};
type Exposure = { id: string; label: string };
type Cohort = { id: string; label: string };
type Run = { id: string };

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [name, setName] = useState("Target-trial vs spontaneous-reporting");
  const [exposureId, setExposureId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, e, c, runData] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Exposure[] }>("/api/exposures"),
      api<{ items: Cohort[] }>("/api/cohorts"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setExposures(e.items);
    setCohorts(c.items);
    setRuns(runData.items);
    if (!exposureId && e.items[0]) setExposureId(e.items[0].id);
    if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
    if (!runId && runData.items[0]) setRunId(runData.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          exposureId,
          cohortId,
          runId,
        }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: target_trial_causal_signal vs spontaneous_reporting_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="e">Exposure</Label>
          <select id="e" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={exposureId} onChange={(ev) => setExposureId(ev.target.value)}>
            {exposures.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="c">Cohort</Label>
          <select id="c" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={cohortId} onChange={(ev) => setCohortId(ev.target.value)}>
            {cohorts.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select id="run" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={runId} onChange={(ev) => setRunId(ev.target.value)}>
            {runs.map((r) => <option key={r.id} value={r.id}>{r.id}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              winner {item.winner} · gap {item.gap} · A {item.targetTrial.overall} · B{" "}
              {item.spontaneous.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--pc-teal)]"
                style={{ width: `${Math.min(100, item.targetTrial.overall)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
