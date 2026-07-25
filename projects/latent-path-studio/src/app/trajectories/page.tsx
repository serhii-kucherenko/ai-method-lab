"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Trajectory = {
  id: string;
  outcomeId: string;
  cohortId: string;
  predictorId: string;
  multiDomainCoverage: number;
  jointClassClarity: number;
  status: string;
};

export function TrajectoriesPage() {
  const [items, setItems] = useState<Trajectory[]>([]);
  const [coverage, setCoverage] = useState("0.7");
  const [clarity, setClarity] = useState("0.72");
  const [separation, setSeparation] = useState("0.68");
  const [readiness, setReadiness] = useState("0.7");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Trajectory[] }>("/api/trajectories")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load trajectories");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/trajectories", {
        method: "POST",
        body: JSON.stringify({
          outcomeId: "outcome-demo",
          cohortId: "cohort-demo",
          predictorId: "predictor-demo",
          multiDomainCoverage: Number(coverage),
          jointClassClarity: Number(clarity),
          trajectorySeparation: Number(separation),
          packReadiness: Number(readiness),
          runNotes: "Soft-sim trajectory class",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create trajectory");
    }
  };

  return (
    <StudioShell
      title="Trajectories"
      subtitle="Configure latent trajectory classes with multi-domain coverage and separation."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="coverage">Multi-domain coverage</Label>
          <Input
            id="coverage"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
          <Label htmlFor="clarity">Joint class clarity</Label>
          <Input
            id="clarity"
            value={clarity}
            onChange={(e) => setClarity(e.target.value)}
          />
          <Label htmlFor="separation">Trajectory separation</Label>
          <Input
            id="separation"
            value={separation}
            onChange={(e) => setSeparation(e.target.value)}
          />
          <Label htmlFor="readiness">Pack readiness</Label>
          <Input
            id="readiness"
            value={readiness}
            onChange={(e) => setReadiness(e.target.value)}
          />
          <Button>Create trajectory</Button>
        </form>
        <section>
          {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{row.id}</h2>
                <p className="text-sm text-slate-600">
                  coverage {row.multiDomainCoverage} · clarity{" "}
                  {row.jointClassClarity} · {row.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default TrajectoriesPage;
