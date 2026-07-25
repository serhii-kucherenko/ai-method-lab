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
  alignmentFree: { overall: number };
  alignmentDependent: { overall: number };
};
type Inpaint = { id: string; label: string };
type Channel = { id: string; label: string };
type Run = { id: string };

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [inpaints, setInpaints] = useState<Inpaint[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [name, setName] = useState("Alignment-free vs alignment-dependent");
  const [inpaintId, setInpaintId] = useState("");
  const [ppgChannelId, setPpgChannelId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, r, p, runData] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Inpaint[] }>("/api/inpaints"),
      api<{ items: Channel[] }>("/api/ppg"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setInpaints(r.items);
    setChannels(p.items);
    setRuns(runData.items);
    if (!inpaintId && r.items[0]) setInpaintId(r.items[0].id);
    if (!ppgChannelId && p.items[0]) setPpgChannelId(p.items[0].id);
    if (!runId && runData.items[0]) setRunId(runData.items[0].id);
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
          inpaintId,
          ppgChannelId,
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
      subtitle="Dual A/B: alignment_free_ppg_ecg vs alignment_dependent_ppg_ecg_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="c">Inpaint recipe</Label>
          <select id="c" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={inpaintId} onChange={(e) => setInpaintId(e.target.value)}>
            {inpaints.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="t">PPG channel</Label>
          <select id="t" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={ppgChannelId} onChange={(e) => setPpgChannelId(e.target.value)}>
            {channels.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select id="run" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={runId} onChange={(e) => setRunId(e.target.value)}>
            {runs.map((r) => <option key={r.id} value={r.id}>{r.id}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · alignment-free {c.alignmentFree.overall} · alignment-dependent {c.alignmentDependent.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div className="score-bar h-full bg-[var(--ne-teal)]" style={{ width: `${Math.min(100, c.alignmentFree.overall)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
