"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  trajectoryId: string;
  forceId: string;
  packCoverage: number;
  fmFidelity: number;
  forceClarity: number;
  runStability: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [trajectories, setTrajectories] = useState<Ref[]>([]);
  const [forces, setForces] = useState<Ref[]>([]);
  const [trajectoryId, setTrajectoryId] = useState("");
  const [forceId, setForceId] = useState("");
  const [packCoverage, setPackCoverage] = useState("0.62");
  const [fmFidelity, setFmFidelity] = useState("0.7");
  const [forceClarity, setForceClarity] = useState("0.74");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, ts, fs] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/trajectories"),
      api<{ items: Ref[] }>("/api/forces"),
    ]);
    setItems(runs.items);
    setTrajectories(ts.items);
    setForces(fs.items);
    if (!trajectoryId && ts.items[0]) setTrajectoryId(ts.items[0].id);
    if (!forceId && fs.items[0]) setForceId(fs.items[0].id);
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
          trajectoryId,
          forceId,
          packCoverage: Number(packCoverage),
          fmFidelity: Number(fmFidelity),
          forceClarity: Number(forceClarity),
          runStability: Number(runStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Atomistic runs"
      subtitle="Soft-sim runs that feed FM vs classical FF compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="traj">Trajectory</Label>
          <select
            id="traj"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={trajectoryId}
            onChange={(e) => setTrajectoryId(e.target.value)}
          >
            {trajectories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="force">Force config</Label>
          <select
            id="force"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={forceId}
            onChange={(e) => setForceId(e.target.value)}
          >
            {forces.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Pack coverage</Label>
          <Input
            id="cov"
            value={packCoverage}
            onChange={(e) => setPackCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">FM fidelity</Label>
          <Input
            id="fid"
            value={fmFidelity}
            onChange={(e) => setFmFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clar">Force clarity</Label>
          <Input
            id="clar"
            value={forceClarity}
            onChange={(e) => setForceClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stab">Run stability</Label>
          <Input
            id="stab"
            value={runStability}
            onChange={(e) => setRunStability(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              cov {r.packCoverage} · fid {r.fmFidelity} · clar{" "}
              {r.forceClarity} · stab {r.runStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
