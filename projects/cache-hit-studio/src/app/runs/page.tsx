"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  compoundSetId: string;
  targetId: string;
  pocketCoverage: number;
  hitFidelity: number;
  ligandGrounding: number;
  packCompleteness: number;
  status: string;
};
type Compound = { id: string; label: string };
type Target = { id: string; label: string };

export function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [compoundSetId, setCompoundSetId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [pocketCoverage, setPocketCoverage] = useState(0.65);
  const [hitFidelity, setHitFidelity] = useState(0.7);
  const [ligandGrounding, setLigandGrounding] = useState(0.72);
  const [packCompleteness, setPackCompleteness] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [runs, c, t] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Compound[] }>("/api/compounds"),
      api<{ items: Target[] }>("/api/targets"),
    ]);
    setItems(runs.items);
    setCompounds(c.items);
    setTargets(t.items);
    if (!compoundSetId && c.items[0]) setCompoundSetId(c.items[0].id);
    if (!targetId && t.items[0]) setTargetId(t.items[0].id);
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
          compoundSetId,
          targetId,
          pocketCoverage,
          hitFidelity,
          ligandGrounding,
          packCompleteness,
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
      subtitle="Capture soft-sim proxies for pocket coverage, hit fidelity, ligand grounding, and pack completeness."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="c">Compound set</Label>
          <select
            id="c"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={compoundSetId}
            onChange={(e) => setCompoundSetId(e.target.value)}
          >
            {compounds.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="t">Target</Label>
          <select
            id="t"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="pocketCoverage">pocketCoverage</Label>
          <Input id="pocketCoverage" type="number" step="0.01" min={0} max={1} value={pocketCoverage} onChange={(e) => setPocketCoverage(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="hitFidelity">hitFidelity</Label>
          <Input id="hitFidelity" type="number" step="0.01" min={0} max={1} value={hitFidelity} onChange={(e) => setHitFidelity(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="ligandGrounding">ligandGrounding</Label>
          <Input id="ligandGrounding" type="number" step="0.01" min={0} max={1} value={ligandGrounding} onChange={(e) => setLigandGrounding(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="packCompleteness">packCompleteness</Label>
          <Input id="packCompleteness" type="number" step="0.01" min={0} max={1} value={packCompleteness} onChange={(e) => setPackCompleteness(Number(e.target.value))} />
        </div>
        <div><Button onClick={() => create()}>Create run</Button></div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <p className="font-medium">{r.id}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              pocket {r.pocketCoverage} · fidelity {r.hitFidelity} · ligand {r.ligandGrounding} · pack {r.packCompleteness}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
