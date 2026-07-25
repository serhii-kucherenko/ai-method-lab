"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  admeId: string;
  topologyId: string;
  structureCoverage: number;
  topologyFidelity: number;
  admeClarity: number;
  compileStability: number;
  status: string;
};

type Ref = { id: string; label: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [admes, setAdmes] = useState<Ref[]>([]);
  const [topologies, setTopologies] = useState<Ref[]>([]);
  const [admeId, setAdmeId] = useState("");
  const [topologyId, setTopologyId] = useState("");
  const [structureCoverage, setStructureCoverage] = useState("0.65");
  const [topologyFidelity, setTopologyFidelity] = useState("0.7");
  const [admeClarity, setAdmeClarity] = useState("0.72");
  const [compileStability, setCompileStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, ads, tops] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/adme"),
      api<{ items: Ref[] }>("/api/topologies"),
    ]);
    setItems(runs.items);
    setAdmes(ads.items);
    setTopologies(tops.items);
    if (!admeId && ads.items[0]) setAdmeId(ads.items[0].id);
    if (!topologyId && tops.items[0]) setTopologyId(tops.items[0].id);
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
          admeId,
          topologyId,
          structureCoverage: Number(structureCoverage),
          topologyFidelity: Number(topologyFidelity),
          admeClarity: Number(admeClarity),
          compileStability: Number(compileStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="PBPK runs"
      subtitle="Record soft-sim structure coverage, topology fidelity, ADME clarity, and compile stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="adme">ADME config</Label>
          <select
            id="adme"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={admeId}
            onChange={(e) => setAdmeId(e.target.value)}
          >
            {admes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="topology">Topology</Label>
          <select
            id="topology"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={topologyId}
            onChange={(e) => setTopologyId(e.target.value)}
          >
            {topologies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="sc">Structure coverage</Label>
          <Input
            id="sc"
            value={structureCoverage}
            onChange={(e) => setStructureCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tf">Topology fidelity</Label>
          <Input
            id="tf"
            value={topologyFidelity}
            onChange={(e) => setTopologyFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ac">ADME clarity</Label>
          <Input
            id="ac"
            value={admeClarity}
            onChange={(e) => setAdmeClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cs">Compile stability</Label>
          <Input
            id="cs"
            value={compileStability}
            onChange={(e) => setCompileStability(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create PBPK run</Button>
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
              S {r.structureCoverage.toFixed(2)} · T{" "}
              {r.topologyFidelity.toFixed(2)} · A {r.admeClarity.toFixed(2)} ·
              C {r.compileStability.toFixed(2)} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
