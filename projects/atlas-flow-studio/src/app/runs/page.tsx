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
  quantificationId: string;
  registrationId: string;
  registrationFidelity: number;
  regionCoverage: number;
  atlasAlignment: number;
  quantStability: number;
  status: string;
};

export function RunsPage() {
  const [quants, setQuants] = useState<Ref[]>([]);
  const [regs, setRegs] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [quantificationId, setQuantificationId] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [registrationFidelity, setRegistrationFidelity] = useState(0.65);
  const [regionCoverage, setRegionCoverage] = useState(0.7);
  const [atlasAlignment, setAtlasAlignment] = useState(0.72);
  const [quantStability, setQuantStability] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [q, r, runs] = await Promise.all([
      api<{ items: Ref[] }>("/api/quantifications"),
      api<{ items: Ref[] }>("/api/registrations"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setQuants(q.items);
    setRegs(r.items);
    setItems(runs.items);
    if (!quantificationId && q.items[0]) setQuantificationId(q.items[0].id);
    if (!registrationId && r.items[0]) setRegistrationId(r.items[0].id);
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
          quantificationId,
          registrationId,
          registrationFidelity,
          regionCoverage,
          atlasAlignment,
          quantStability,
          runNotes: "Soft-sim atlas run",
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
      subtitle="Capture soft-sim proxies for registration fidelity, coverage, alignment, and quant stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="quant">Quantification</Label>
          <select
            id="quant"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={quantificationId}
            onChange={(e) => setQuantificationId(e.target.value)}
          >
            {quants.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label ?? q.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="reg">Registration</Label>
          <select
            id="reg"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
          >
            {regs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label ?? r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="fid">Registration fidelity</Label>
          <Input
            id="fid"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={registrationFidelity}
            onChange={(e) => setRegistrationFidelity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="cov">Region coverage</Label>
          <Input
            id="cov"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={regionCoverage}
            onChange={(e) => setRegionCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="align">Atlas alignment</Label>
          <Input
            id="align"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={atlasAlignment}
            onChange={(e) => setAtlasAlignment(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="stab">Quant stability</Label>
          <Input
            id="stab"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={quantStability}
            onChange={(e) => setQuantStability(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create run</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--af-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((run) => (
          <li
            key={run.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{run.id.slice(0, 8)}…</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              fid {run.registrationFidelity} · cov {run.regionCoverage} · align{" "}
              {run.atlasAlignment} · stab {run.quantStability} · {run.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
