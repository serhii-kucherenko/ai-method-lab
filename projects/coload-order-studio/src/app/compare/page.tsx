"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  ordered: { overall: number; orderScore: number; chemoScore: number };
  simultaneous: { overall: number; synergyScore: number; leakPenalty: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Ordered vs simultaneous");
  const [packId, setPackId] = useState("pack-demo");
  const [carrierId, setCarrierId] = useState("carrier-demo");
  const [loadId, setLoadId] = useState("load-demo");
  const [assayRunId, setAssayRunId] = useState("assay-demo");
  const [loadBias, setLoadBias] = useState("chemo_first");

  const refresh = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          packId,
          carrierId,
          loadId,
          assayRunId,
          loadBias,
        }),
      });
      await refresh();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Dual compare"
      subtitle="Scorer A ordered_coload_sequence vs scorer B simultaneous_load_baseline."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="packId">Pack</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} />
          <Label htmlFor="carrierId">Carrier</Label>
          <Input id="carrierId" value={carrierId} onChange={(e) => setCarrierId(e.target.value)} />
          <Label htmlFor="loadId">Load</Label>
          <Input id="loadId" value={loadId} onChange={(e) => setLoadId(e.target.value)} />
          <Label htmlFor="assay">Assay</Label>
          <Input id="assay" value={assayRunId} onChange={(e) => setAssayRunId(e.target.value)} />
          <Label htmlFor="bias">Load bias</Label>
          <Input id="bias" value={loadBias} onChange={(e) => setLoadBias(e.target.value)} />
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="rounded-lg border bg-white p-4">
              <p className="font-medium">{c.name}</p>
              <p className="mt-1 text-sm">
                Winner: <span className="text-[var(--co-amber)]">{c.winner}</span> · gap{" "}
                {c.gap}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--co-slate)]">
                    Ordered co-load
                  </p>
                  <div className="mt-1 h-2 rounded bg-[var(--co-mist)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--co-amber)]"
                      style={{ width: `${c.ordered.overall}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm">{c.ordered.overall}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--co-slate)]">
                    Simultaneous baseline
                  </p>
                  <div className="mt-1 h-2 rounded bg-[var(--co-mist)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--co-slate)]"
                      style={{ width: `${c.simultaneous.overall}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm">{c.simultaneous.overall}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
