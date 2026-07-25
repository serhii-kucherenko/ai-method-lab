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
  patientSpecific: { overall: number };
  populationBaseline: { overall: number };
};

export default function ComparePage() {
  const [detections, setDetections] = useState<Ref[]>([]);
  const [channels, setChannels] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "Patient-specific E-norms vs population baseline",
  );
  const [detectionId, setDetectionId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [d, c, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/detections"),
      api<{ items: Ref[] }>("/api/channels"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setDetections(d.items);
    setChannels(c.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!detectionId && d.items[0]) setDetectionId(d.items[0].id);
    if (!channelId && c.items[0]) setChannelId(c.items[0].id);
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
        body: JSON.stringify({ name, detectionId, channelId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: patient_specific_enorms vs population_norm_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="detection">Detection</Label>
          <select
            id="detection"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={detectionId}
            onChange={(e) => setDetectionId(e.target.value)}
          >
            {detections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="channel">Channel config</Label>
          <select
            id="channel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            {channels.map((m) => (
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
                  Patient-specific E-norms (A)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--eb-teal)]"
                    style={{ width: `${c.patientSpecific.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.patientSpecific.overall}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  Population baseline (B)
                </div>
                <div className="mt-1 h-2 rounded bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-2 rounded bg-[var(--eb-amber)]"
                    style={{ width: `${c.populationBaseline.overall}%` }}
                  />
                </div>
                <div className="mt-1 text-sm">{c.populationBaseline.overall}</div>
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
