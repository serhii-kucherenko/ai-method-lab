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
  agentCoverage: number;
  moduleCoordination: number;
  suppressionProxy: number;
  vectorPressureProxy: number;
  status: string;
};

export function RunsPage() {
  const [populations, setPopulations] = useState<Ref[]>([]);
  const [modules, setModules] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [populationId, setPopulationId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [agentCoverage, setAgentCoverage] = useState(0.65);
  const [moduleCoordination, setModuleCoordination] = useState(0.7);
  const [suppressionProxy, setSuppressionProxy] = useState(0.72);
  const [vectorPressureProxy, setVectorPressureProxy] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [t, s, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/populations"),
      api<{ items: Ref[] }>("/api/modules"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setPopulations(t.items);
    setModules(s.items);
    setItems(r.items);
    if (!populationId && t.items[0]) setPopulationId(t.items[0].id);
    if (!moduleId && s.items[0]) setModuleId(s.items[0].id);
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
          populationId,
          moduleId,
          agentCoverage,
          moduleCoordination,
          suppressionProxy,
          vectorPressureProxy,
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
      subtitle="Soft-sim runs capturing agent coverage, coordination, suppression, and vector pressure."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="population">Population set</Label>
          <select
            id="population"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={populationId}
            onChange={(e) => setPopulationId(e.target.value)}
          >
            {populations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label ?? t.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="module">Module</Label>
          <select
            id="module"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
          >
            {modules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Agent coverage</Label>
          <Input
            id="cov"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={agentCoverage}
            onChange={(e) => setAgentCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="fid">Module coordination</Label>
          <Input
            id="fid"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={moduleCoordination}
            onChange={(e) => setModuleCoordination(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="sup">Suppression proxy</Label>
          <Input
            id="sup"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={suppressionProxy}
            onChange={(e) => setSuppressionProxy(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="vec">Vector pressure proxy</Label>
          <Input
            id="vec"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={vectorPressureProxy}
            onChange={(e) => setVectorPressureProxy(Number(e.target.value))}
          />
        </div>
        <div>
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
            <p className="text-sm">
              cov {r.agentCoverage} · coord {r.moduleCoordination} · supp{" "}
              {r.suppressionProxy} · vec {r.vectorPressureProxy} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
