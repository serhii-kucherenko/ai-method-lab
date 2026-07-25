"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  designerId: string;
  targetId: string;
  inverseCoverage: number;
  poreFidelity: number;
  targetClarity: number;
  designerStability: number;
  status: string;
};

type Ref = { id: string; label: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [designers, setDesigners] = useState<Ref[]>([]);
  const [targets, setTargets] = useState<Ref[]>([]);
  const [designerId, setDesignerId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [inverseCoverage, setInverseCoverage] = useState("0.65");
  const [poreFidelity, setPoreFidelity] = useState("0.7");
  const [targetClarity, setTargetClarity] = useState("0.72");
  const [designerStability, setDesignerStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, des, tars] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/designers"),
      api<{ items: Ref[] }>("/api/targets"),
    ]);
    setItems(runs.items);
    setDesigners(des.items);
    setTargets(tars.items);
    if (!designerId && des.items[0]) setDesignerId(des.items[0].id);
    if (!targetId && tars.items[0]) setTargetId(tars.items[0].id);
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
          designerId,
          targetId,
          inverseCoverage: Number(inverseCoverage),
          poreFidelity: Number(poreFidelity),
          targetClarity: Number(targetClarity),
          designerStability: Number(designerStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Pore runs"
      subtitle="Record soft-sim inverse coverage, pore fidelity, target clarity, and designer stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="designer">Designer config</Label>
          <select
            id="designer"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={designerId}
            onChange={(e) => setDesignerId(e.target.value)}
          >
            {designers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="target">Pore target</Label>
          <select
            id="target"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="ic">Inverse coverage</Label>
          <Input
            id="ic"
            value={inverseCoverage}
            onChange={(e) => setInverseCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pf">Pore fidelity</Label>
          <Input
            id="pf"
            value={poreFidelity}
            onChange={(e) => setPoreFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tc">Target clarity</Label>
          <Input
            id="tc"
            value={targetClarity}
            onChange={(e) => setTargetClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ds">Designer stability</Label>
          <Input
            id="ds"
            value={designerStability}
            onChange={(e) => setDesignerStability(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create pore run</Button>
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
              I {r.inverseCoverage.toFixed(2)} · P {r.poreFidelity.toFixed(2)} ·
              T {r.targetClarity.toFixed(2)} · D{" "}
              {r.designerStability.toFixed(2)} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
