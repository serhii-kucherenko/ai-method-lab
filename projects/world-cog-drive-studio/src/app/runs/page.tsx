"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Run = {
  id: string;
  policyId: string;
  worldId: string;
  worldForecastFit: number;
  cognitiveDepth: number;
  actionAlignment: number;
  trajectoryIntegrity: number;
  status: string;
};

export default function RunsPage() {
  const [policies, setPolicies] = useState<Ref[]>([]);
  const [worlds, setWorlds] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [policyId, setPolicyId] = useState("");
  const [worldId, setWorldId] = useState("");
  const [worldForecastFit, setWorldForecastFit] = useState("0.6");
  const [cognitiveDepth, setCognitiveDepth] = useState("0.7");
  const [actionAlignment, setActionAlignment] = useState("0.72");
  const [trajectoryIntegrity, setTrajectoryIntegrity] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [p, w, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/policies"),
      api<{ items: Ref[] }>("/api/worlds"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setPolicies(p.items);
    setWorlds(w.items);
    setItems(r.items);
    if (!policyId && p.items[0]) setPolicyId(p.items[0].id);
    if (!worldId && w.items[0]) setWorldId(w.items[0].id);
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
          policyId,
          worldId,
          worldForecastFit: Number(worldForecastFit),
          cognitiveDepth: Number(cognitiveDepth),
          actionAlignment: Number(actionAlignment),
          trajectoryIntegrity: Number(trajectoryIntegrity),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Drive runs"
      subtitle="Soft-sim drive runs that feed dual A/B compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="policy">Action policy</Label>
          <select
            id="policy"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="world">World config</Label>
          <select
            id="world"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={worldId}
            onChange={(e) => setWorldId(e.target.value)}
          >
            {worlds.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="fit">World forecast fit</Label>
          <Input
            id="fit"
            value={worldForecastFit}
            onChange={(e) => setWorldForecastFit(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cog">Cognitive depth</Label>
          <Input
            id="cog"
            value={cognitiveDepth}
            onChange={(e) => setCognitiveDepth(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="align">Action alignment</Label>
          <Input
            id="align"
            value={actionAlignment}
            onChange={(e) => setActionAlignment(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="traj">Trajectory integrity</Label>
          <Input
            id="traj"
            value={trajectoryIntegrity}
            onChange={(e) => setTrajectoryIntegrity(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              world {r.worldForecastFit} · cognitive {r.cognitiveDepth} ·
              action {r.actionAlignment} · traj {r.trajectoryIntegrity} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
