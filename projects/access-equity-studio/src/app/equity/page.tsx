"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Gate = { id: string; label: string; lockCondition: string; status: string; equityChannel: string };
type Run = { id: string; accessReach: number; equityGapClosure: number; taskSharingFidelity: number; status: string };

export function EquityPage() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [g, r] = await Promise.all([
        api<{ items: Gate[] }>("/api/equity"),
        api<{ items: Run[] }>("/api/equity?runs=1"),
      ]);
      setGates(g.items);
      setRuns(r.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load equity");
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/equity", {
        method: "POST",
        body: JSON.stringify({ packId: "pack-demo", label, gateNotes: "Access and equity under dual methods", lockCondition: "review", equityChannel: "soft_sim_access_equity" }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create gate");
    }
  };

  const runSoftSim = async () => {
    try {
      await api("/api/equity", {
        method: "POST",
        body: JSON.stringify({
          action: "run",
          equityGateId: "equity-demo",
          cohortId: "cohort-demo",
          screenId: "screen-demo",
          pathwayId: "pathway-demo",
          accessReach: 0.72,
          equityGapClosure: 0.68,
          taskSharingFidelity: 0.7,
          packReadiness: 0.65,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Run failed");
    }
  };

  return (
    <StudioShell title="Equity gates" subtitle="Configure equity gates and soft-sim access runs before dual compare.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Gate label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Button>Create equity gate</Button>
          <Button type="button" variant="outline" onClick={() => void runSoftSim()}>Run access soft-sim</Button>
        </form>
        <section className="space-y-6">
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            <h2 className="font-semibold">Gates</h2>
            {gates.map((g) => (
              <article key={g.id} className="row-lift rounded-lg border bg-white p-4">
                <h3 className="font-semibold">{g.label}</h3>
                <p className="text-sm text-slate-600">{g.lockCondition} · {g.equityChannel} · {g.status}</p>
              </article>
            ))}
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold">Access runs</h2>
            {runs.map((r) => (
              <article key={r.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="text-sm">reach {r.accessReach} · equity {r.equityGapClosure} · sharing {r.taskSharingFidelity} · {r.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default EquityPage;
