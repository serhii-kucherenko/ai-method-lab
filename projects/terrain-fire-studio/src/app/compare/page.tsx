"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Aerial = { id: string; captureDate: string };
type Plan = { id: string; alignmentBias: string };
type Quality = {
  overall: number;
  elevationFidelity: number;
  slopeCoherence: number;
  seamContinuity: number;
  fuelLayerFidelity: number;
  photogrammetryScore: number;
};
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  physicsAware: Quality;
  naiveOverlay: Quality;
};

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-stone-500">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded bg-stone-200">
        <div
          className="score-bar h-2 rounded bg-[var(--studio-ember)]"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [aerials, setAerials] = useState<Aerial[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [packId, setPackId] = useState("");
  const [aerialId, setAerialId] = useState("");
  const [planId, setPlanId] = useState("");
  const [name, setName] = useState("Ridge refresh A/B");
  const [latest, setLatest] = useState<Compare | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const packData = await api<{ items: Pack[] }>("/api/packs");
    setPacks(packData.items);
    const pid = packId || packData.items[0]?.id || "";
    if (!packId && pid) setPackId(pid);
    const aerialData = await api<{ items: Aerial[] }>(
      `/api/aerials?packId=${pid}`,
    );
    setAerials(aerialData.items);
    const aid = aerialId || aerialData.items[0]?.id || "";
    if (!aerialId && aid) setAerialId(aid);
    const planData = await api<{ items: Plan[] }>(
      `/api/alignment?packId=${pid}`,
    );
    setPlans(planData.items);
    const plid = planId || planData.items[0]?.id || "";
    if (!planId && plid) setPlanId(plid);
    const cmp = await api<{ items: Compare[] }>("/api/compare");
    setCompares(cmp.items);
    if (cmp.items[0]) setLatest(cmp.items[0]);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      const res = await api<{ compare: Compare }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, packId, aerialId, planId }),
      });
      setLatest(res.compare);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const ready = packs.length > 0 && aerials.length > 0 && plans.length > 0;

  return (
    <StudioShell
      title="Compare refresh quality"
      subtitle="Physics-aware terrain refresh (A) vs naive photo-on-DEM overlay (B)."
    >
      {!ready ? (
        <p className="text-sm text-stone-500">
          Need pack + aerial + alignment plan — seed from onboarding or create
          each entity first.
        </p>
      ) : (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
          <div>
            <Label htmlFor="name">Compare name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pack">Pack</Label>
            <select
              id="pack"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
              value={packId}
              onChange={(e) => setPackId(e.target.value)}
            >
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="aerial">Aerial</Label>
            <select
              id="aerial"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
              value={aerialId}
              onChange={(e) => setAerialId(e.target.value)}
            >
              {aerials.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.captureDate}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={run}>Run A vs B</Button>
          </div>
        </div>
      )}
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {latest ? (
        <div className="pack-rise mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-ember)]">
              A — Physics-aware
            </h2>
            <p className="mb-3 text-2xl font-semibold">
              {latest.physicsAware.overall.toFixed(1)}
            </p>
            <Bar label="Elevation" value={latest.physicsAware.elevationFidelity} />
            <Bar label="Slope" value={latest.physicsAware.slopeCoherence} />
            <Bar label="Seam" value={latest.physicsAware.seamContinuity} />
            <Bar label="Fuel layer" value={latest.physicsAware.fuelLayerFidelity} />
            <Bar label="Photo" value={latest.physicsAware.photogrammetryScore} />
          </div>
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-ridge)]">
              B — Naive overlay
            </h2>
            <p className="mb-3 text-2xl font-semibold">
              {latest.naiveOverlay.overall.toFixed(1)}
            </p>
            <Bar label="Elevation" value={latest.naiveOverlay.elevationFidelity} />
            <Bar label="Slope" value={latest.naiveOverlay.slopeCoherence} />
            <Bar label="Seam" value={latest.naiveOverlay.seamContinuity} />
            <Bar label="Fuel layer" value={latest.naiveOverlay.fuelLayerFidelity} />
            <Bar label="Photo" value={latest.naiveOverlay.photogrammetryScore} />
          </div>
          <p className="md:col-span-2 text-sm text-stone-600">
            Winner: <strong>{latest.winner}</strong> · gap {latest.gap}
          </p>
        </div>
      ) : null}
      {compares.length > 0 ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-stone-500">
              <th className="py-2">Name</th>
              <th>Winner</th>
              <th>Gap</th>
              <th>A</th>
              <th>B</th>
            </tr>
          </thead>
          <tbody>
            {compares.map((c) => (
              <tr key={c.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2">{c.name}</td>
                <td>{c.winner}</td>
                <td>{c.gap}</td>
                <td>{c.physicsAware.overall}</td>
                <td>{c.naiveOverlay.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </StudioShell>
  );
}
