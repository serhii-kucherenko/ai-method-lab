"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; cycleDepth: number; enrichmentFold: number; status: string };

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [cycleDepth, setCycleDepth] = useState("0.65");
  const [enrichmentFold, setEnrichmentFold] = useState("0.7");
  const [diversityRetention, setDiversityRetention] = useState("0.72");
  const [hitPrecision, setHitPrecision] = useState("0.68");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/assays")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          libraryId: "library-demo",
          cycleId: "cycle-demo",
          hitId: "hit-demo",
          cycleDepth: Number(cycleDepth),
          enrichmentFold: Number(enrichmentFold),
          diversityRetention: Number(diversityRetention),
          hitPrecision: Number(hitPrecision),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay runs"
      subtitle="Soft-sim assay runs that feed iterative DELT vs single-pass compares."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="cycleDepth">Cycle depth</Label>
          <Input id="cycleDepth" value={cycleDepth} onChange={(e) => setCycleDepth(e.target.value)} />
          <Label htmlFor="enrichmentFold">Enrichment fold</Label>
          <Input id="enrichmentFold" value={enrichmentFold} onChange={(e) => setEnrichmentFold(e.target.value)} />
          <Label htmlFor="diversityRetention">Diversity retention</Label>
          <Input id="diversityRetention" value={diversityRetention} onChange={(e) => setDiversityRetention(e.target.value)} />
          <Label htmlFor="hitPrecision">Hit precision</Label>
          <Input id="hitPrecision" value={hitPrecision} onChange={(e) => setHitPrecision(e.target.value)} />
          <Button>Create assay run</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.id}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  depth {row.cycleDepth} · enrichment {row.enrichmentFold} · {row.status}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
