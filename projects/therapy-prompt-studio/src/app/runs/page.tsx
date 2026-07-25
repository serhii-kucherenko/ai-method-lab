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
  gateId: string;
  scenarioId: string;
  gateCoverage: number;
  refusalStrength: number;
  crisisEscalation: number;
  boundaryClarity: number;
  status: string;
};

export function RunsPage() {
  const [gates, setGates] = useState<Ref[]>([]);
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [gateId, setGateId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [gateCoverage, setGateCoverage] = useState("0.65");
  const [refusalStrength, setRefusalStrength] = useState("0.7");
  const [crisisEscalation, setCrisisEscalation] = useState("0.72");
  const [boundaryClarity, setBoundaryClarity] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [g, s, runs] = await Promise.all([
      api<{ items: Ref[] }>("/api/gates"),
      api<{ items: Ref[] }>("/api/scenarios"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setGates(g.items);
    setScenarios(s.items);
    setItems(runs.items);
    if (!gateId && g.items[0]) setGateId(g.items[0].id);
    if (!scenarioId && s.items[0]) setScenarioId(s.items[0].id);
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
          gateId,
          scenarioId,
          gateCoverage: Number(gateCoverage),
          refusalStrength: Number(refusalStrength),
          crisisEscalation: Number(crisisEscalation),
          boundaryClarity: Number(boundaryClarity),
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
      subtitle="Therapy-safety soft-sim runs capturing gate and refusal proxies."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="gate">Gate</Label>
          <select
            id="gate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
          >
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label ?? g.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="scenario">Scenario</Label>
          <select
            id="scenario"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="coverage">Gate coverage</Label>
          <Input
            id="coverage"
            value={gateCoverage}
            onChange={(e) => setGateCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="refusal">Refusal strength</Label>
          <Input
            id="refusal"
            value={refusalStrength}
            onChange={(e) => setRefusalStrength(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="crisis">Crisis escalation</Label>
          <Input
            id="crisis"
            value={crisisEscalation}
            onChange={(e) => setCrisisEscalation(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="boundary">Boundary clarity</Label>
          <Input
            id="boundary"
            value={boundaryClarity}
            onChange={(e) => setBoundaryClarity(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Capture therapy-safety run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id.slice(0, 8)}…</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {r.gateCoverage} · refusal {r.refusalStrength} · crisis{" "}
              {r.crisisEscalation} · boundary {r.boundaryClarity} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
