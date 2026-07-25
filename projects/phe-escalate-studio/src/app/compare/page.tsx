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
  aiAssisted: { overall: number };
  manualTriage: { overall: number };
};

export function ComparePage() {
  const [thresholds, setThresholds] = useState<Ref[]>([]);
  const [classifications, setClassifications] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "AI-assisted escalation vs manual triage baseline",
  );
  const [thresholdId, setThresholdId] = useState("");
  const [classificationId, setClassificationId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [t, s, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/thresholds"),
      api<{ items: Ref[] }>("/api/classifications"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setThresholds(t.items);
    setClassifications(s.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!thresholdId && t.items[0]) setThresholdId(t.items[0].id);
    if (!classificationId && s.items[0]) setClassificationId(s.items[0].id);
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
          thresholdId,
          classificationId,
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
      subtitle="Dual A/B: ai_assisted_phe_escalation vs manual_triage_baseline."
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
          <Label htmlFor="threshold">Threshold</Label>
          <select
            id="threshold"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={thresholdId}
            onChange={(e) => setThresholdId(e.target.value)}
          >
            {thresholds.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="classification">Classification</Label>
          <select
            id="classification"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={classificationId}
            onChange={(e) => setClassificationId(e.target.value)}
          >
            {classifications.map((m) => (
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
              A {c.aiAssisted.overall} · B {c.manualTriage.overall} · winner{" "}
              {c.winner} · gap {c.gap}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
