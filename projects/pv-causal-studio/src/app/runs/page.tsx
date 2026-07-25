"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Cohort = { id: string; label: string };
type Exposure = { id: string; label: string };
type Run = {
  id: string;
  exposureId: string;
  cohortId: string;
  cohortCoverage: number;
  exposureFidelity: number;
  confounderControl: number;
  packCompleteness: number;
  runNotes: string;
  status: string;
};

export function RunsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [exposureId, setExposureId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [cohortCoverage, setCohortCoverage] = useState("0.7");
  const [exposureFidelity, setExposureFidelity] = useState("0.72");
  const [confounderControl, setConfounderControl] = useState("0.68");
  const [packCompleteness, setPackCompleteness] = useState("0.65");
  const [runNotes, setRunNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [c, e, runs] = await Promise.all([
      api<{ items: Cohort[] }>("/api/cohorts"),
      api<{ items: Exposure[] }>("/api/exposures"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setCohorts(c.items);
    setExposures(e.items);
    setItems(runs.items);
    if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
    if (!exposureId && e.items[0]) setExposureId(e.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          exposureId,
          cohortId,
          cohortCoverage: Number(cohortCoverage),
          exposureFidelity: Number(exposureFidelity),
          confounderControl: Number(confounderControl),
          packCompleteness: Number(packCompleteness),
          runNotes,
        }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Capture soft-sim proxies for target-trial causal signal runs."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="exposure">Exposure</Label>
          <select
            id="exposure"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={exposureId}
            onChange={(e) => setExposureId(e.target.value)}
          >
            {exposures.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cohort">Cohort</Label>
          <select
            id="cohort"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
          >
            {cohorts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cc">Cohort coverage (0–1)</Label>
          <Input id="cc" value={cohortCoverage} onChange={(e) => setCohortCoverage(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ef">Exposure fidelity (0–1)</Label>
          <Input id="ef" value={exposureFidelity} onChange={(e) => setExposureFidelity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cf">Confounder control (0–1)</Label>
          <Input id="cf" value={confounderControl} onChange={(e) => setConfounderControl(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pack">Pack completeness (0–1)</Label>
          <Input id="pack" value={packCompleteness} onChange={(e) => setPackCompleteness(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Run notes</Label>
          <Input id="notes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>Create signal run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id.slice(0, 8)}… · {r.status}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              cohort {r.cohortCoverage} · exposure {r.exposureFidelity} · causal{" "}
              {r.confounderControl} · pack {r.packCompleteness}
            </p>
            {r.runNotes ? <p className="mt-1 text-sm">{r.runNotes}</p> : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
