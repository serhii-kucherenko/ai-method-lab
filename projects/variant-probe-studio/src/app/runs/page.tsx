"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  mechanismId: string;
  probeId: string;
  panelCoverage: number;
  probeFidelity: number;
  mechanismClarity: number;
  runStability: number;
  status: string;
};

type Ref = { id: string; label?: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [mechanisms, setMechanisms] = useState<Ref[]>([]);
  const [probes, setProbes] = useState<Ref[]>([]);
  const [mechanismId, setMechanismId] = useState("");
  const [probeId, setProbeId] = useState("");
  const [panelCoverage, setPanelCoverage] = useState("0.65");
  const [probeFidelity, setProbeFidelity] = useState("0.7");
  const [mechanismClarity, setMechanismClarity] = useState("0.72");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, ms, ps] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/mechanisms"),
      api<{ items: Ref[] }>("/api/probes"),
    ]);
    setItems(runs.items);
    setMechanisms(ms.items);
    setProbes(ps.items);
    if (!mechanismId && ms.items[0]) setMechanismId(ms.items[0].id);
    if (!probeId && ps.items[0]) setProbeId(ps.items[0].id);
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
          mechanismId,
          probeId,
          panelCoverage: Number(panelCoverage),
          probeFidelity: Number(probeFidelity),
          mechanismClarity: Number(mechanismClarity),
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
      title="Variant runs"
      subtitle="Soft-sim runs that feed dual interpretable vs opaque compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="mechanism">Mechanism link</Label>
          <select
            id="mechanism"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={mechanismId}
            onChange={(e) => setMechanismId(e.target.value)}
          >
            {mechanisms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="probe">Probe config</Label>
          <select
            id="probe"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={probeId}
            onChange={(e) => setProbeId(e.target.value)}
          >
            {probes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Panel coverage</Label>
          <Input
            id="cov"
            value={panelCoverage}
            onChange={(e) => setPanelCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Probe fidelity</Label>
          <Input
            id="fid"
            value={probeFidelity}
            onChange={(e) => setProbeFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clr">Mechanism clarity</Label>
          <Input
            id="clr"
            value={mechanismClarity}
            onChange={(e) => setMechanismClarity(e.target.value)}
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
        <div className="md:col-span-2">
          <Button onClick={create}>Create variant run</Button>
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
              cov {r.panelCoverage} · fid {r.probeFidelity} · clr{" "}
              {r.mechanismClarity} · stab {r.runStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
