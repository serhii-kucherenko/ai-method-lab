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
  ose: { overall: number };
  openLam: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("OSE vs open laminectomy");
  const [packId, setPackId] = useState("pack-demo");
  const [caseId, setCaseId] = useState("case-demo");
  const [approachId, setApproachId] = useState("approach-demo");
  const [outcomeId, setOutcomeId] = useState("outcome-demo");

  const load = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, packId, caseId, approachId, outcomeId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: one_hole_split_endoscopy vs open_laminectomy — soft-sim only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="caseId">Case id</Label>
          <Input id="caseId" value={caseId} onChange={(e) => setCaseId(e.target.value)} required />
          <Label htmlFor="approachId">Approach id</Label>
          <Input id="approachId" value={approachId} onChange={(e) => setApproachId(e.target.value)} required />
          <Label htmlFor="outcomeId">Outcome id</Label>
          <Input id="outcomeId" value={outcomeId} onChange={(e) => setOutcomeId(e.target.value)} required />
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {row.winner} · gap {row.gap} · OSE {row.ose.overall} ·
                open {row.openLam.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
