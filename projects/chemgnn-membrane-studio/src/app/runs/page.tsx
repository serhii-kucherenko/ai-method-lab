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
  graphCoverage: number;
  poreGeometryFidelity: number;
  saltRejectionProxy: number;
  waterFluxProxy: number;
  status: string;
};

export default function RunsPage() {
  const [surrogates, setSurrogates] = useState<Ref[]>([]);
  const [graphs, setGraphs] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [surrogateId, setSurrogateId] = useState("");
  const [graphId, setGraphId] = useState("");
  const [graphCoverage, setGraphCoverage] = useState(0.65);
  const [poreGeometryFidelity, setPoreGeometryFidelity] = useState(0.7);
  const [saltRejectionProxy, setSaltRejectionProxy] = useState(0.72);
  const [waterFluxProxy, setWaterFluxProxy] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [t, s, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/surrogates"),
      api<{ items: Ref[] }>("/api/graphs"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setSurrogates(t.items);
    setGraphs(s.items);
    setItems(r.items);
    if (!surrogateId && t.items[0]) setSurrogateId(t.items[0].id);
    if (!graphId && s.items[0]) setGraphId(s.items[0].id);
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
          surrogateId,
          graphId,
          graphCoverage,
          poreGeometryFidelity,
          saltRejectionProxy,
          waterFluxProxy,
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
      subtitle="Soft-sim runs capturing graph coverage, pore fidelity, rejection, and flux."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="surrogate">Surrogate set</Label>
          <select
            id="surrogate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={surrogateId}
            onChange={(e) => setSurrogateId(e.target.value)}
          >
            {surrogates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label ?? t.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="graph">Graph</Label>
          <select
            id="graph"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={graphId}
            onChange={(e) => setGraphId(e.target.value)}
          >
            {graphs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Graph coverage</Label>
          <Input
            id="cov"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={graphCoverage}
            onChange={(e) => setGraphCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="fid">Pore geometry fidelity</Label>
          <Input
            id="fid"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={poreGeometryFidelity}
            onChange={(e) => setPoreGeometryFidelity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="rej">Salt rejection proxy</Label>
          <Input
            id="rej"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={saltRejectionProxy}
            onChange={(e) => setSaltRejectionProxy(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="flux">Water flux proxy</Label>
          <Input
            id="flux"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={waterFluxProxy}
            onChange={(e) => setWaterFluxProxy(Number(e.target.value))}
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
              cov {r.graphCoverage} · pore {r.poreGeometryFidelity} · rej{" "}
              {r.saltRejectionProxy} · flux {r.waterFluxProxy} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
