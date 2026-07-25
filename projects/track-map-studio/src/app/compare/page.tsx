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
  onlineSlam: { overall: number };
  offlineKinematics: { overall: number };
};
type Recon = { id: string; label: string };
type Pose = { id: string; label: string };
type Run = { id: string };

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [recons, setRecons] = useState<Recon[]>([]);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [name, setName] = useState("Online SLAM vs kinematics-prior");
  const [reconstructionId, setReconstructionId] = useState("");
  const [poseConfigId, setPoseConfigId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, r, p, runData] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Recon[] }>("/api/reconstructions"),
      api<{ items: Pose[] }>("/api/poses"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setRecons(r.items);
    setPoses(p.items);
    setRuns(runData.items);
    if (!reconstructionId && r.items[0]) setReconstructionId(r.items[0].id);
    if (!poseConfigId && p.items[0]) setPoseConfigId(p.items[0].id);
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
          reconstructionId,
          poseConfigId,
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
      subtitle="Dual A/B: online_deformable_slam vs offline_kinematics_prior_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="c">Reconstruction</Label>
          <select id="c" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={reconstructionId} onChange={(e) => setReconstructionId(e.target.value)}>
            {recons.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="t">Pose config</Label>
          <select id="t" className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm" value={poseConfigId} onChange={(e) => setPoseConfigId(e.target.value)}>
            {poses.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
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
              Winner {c.winner} · gap {c.gap} · online SLAM {c.onlineSlam.overall} · offline kinematics {c.offlineKinematics.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div className="score-bar h-full bg-[var(--tm-teal)]" style={{ width: `${Math.min(100, c.onlineSlam.overall)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
