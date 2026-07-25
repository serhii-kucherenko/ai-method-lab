"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pose = { id: string; label: string };
type Recon = { id: string; label: string };
type Run = {
  id: string;
  reconstructionId: string;
  poseConfigId: string;
  deformCoverage: number;
  slamFidelity: number;
  poseGrounding: number;
  packCompleteness: number;
  runNotes: string;
  status: string;
};

export function RunsPage() {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [recons, setRecons] = useState<Recon[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [reconstructionId, setReconstructionId] = useState("");
  const [poseConfigId, setPoseConfigId] = useState("");
  const [deformCoverage, setDeformCoverage] = useState("0.7");
  const [slamFidelity, setSlamFidelity] = useState("0.72");
  const [poseGrounding, setPoseGrounding] = useState("0.68");
  const [packCompleteness, setPackCompleteness] = useState("0.65");
  const [runNotes, setRunNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, r, runs] = await Promise.all([
      api<{ items: Pose[] }>("/api/poses"),
      api<{ items: Recon[] }>("/api/reconstructions"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setPoses(p.items);
    setRecons(r.items);
    setItems(runs.items);
    if (!poseConfigId && p.items[0]) setPoseConfigId(p.items[0].id);
    if (!reconstructionId && r.items[0]) setReconstructionId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          reconstructionId,
          poseConfigId,
          deformCoverage: Number(deformCoverage),
          slamFidelity: Number(slamFidelity),
          poseGrounding: Number(poseGrounding),
          packCompleteness: Number(packCompleteness),
          runNotes,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Capture soft-sim proxies for online deformable SLAM track runs."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="recon">Reconstruction</Label>
          <select
            id="recon"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={reconstructionId}
            onChange={(e) => setReconstructionId(e.target.value)}
          >
            {recons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="pose">Pose config</Label>
          <select
            id="pose"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={poseConfigId}
            onChange={(e) => setPoseConfigId(e.target.value)}
          >
            {poses.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="deform">Deform coverage (0–1)</Label>
          <Input id="deform" value={deformCoverage} onChange={(e) => setDeformCoverage(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="slam">SLAM fidelity (0–1)</Label>
          <Input id="slam" value={slamFidelity} onChange={(e) => setSlamFidelity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="poseG">Pose grounding (0–1)</Label>
          <Input id="poseG" value={poseGrounding} onChange={(e) => setPoseGrounding(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pack">Pack completeness (0–1)</Label>
          <Input id="pack" value={packCompleteness} onChange={(e) => setPackCompleteness(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Run notes</Label>
          <Input id="notes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>Create track run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id.slice(0, 8)}… · {r.status}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              deform {r.deformCoverage} · slam {r.slamFidelity} · pose{" "}
              {r.poseGrounding} · pack {r.packCompleteness}
            </p>
            {r.runNotes ? <p className="mt-1 text-sm">{r.runNotes}</p> : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
