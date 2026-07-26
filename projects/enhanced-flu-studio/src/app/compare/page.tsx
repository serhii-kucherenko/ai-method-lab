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
  expanded: { overall: number };
  baseline: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Nordic EIV vs policy");
  const [packId, setPackId] = useState("pack-demo");
  const [countryId, setCountryId] = useState("country-demo");
  const [programId, setProgramId] = useState("program-demo");
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
        body: JSON.stringify({ name, packId, countryId, programId, outcomeId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: expanded_eiv_program vs current_policy_baseline — soft-sim only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="countryId">Country id</Label>
          <Input id="countryId" value={countryId} onChange={(e) => setCountryId(e.target.value)} required />
          <Label htmlFor="programId">Program id</Label>
          <Input id="programId" value={programId} onChange={(e) => setProgramId(e.target.value)} required />
          <Label htmlFor="outcomeId">Outcome id</Label>
          <Input id="outcomeId" value={outcomeId} onChange={(e) => setOutcomeId(e.target.value)} required />
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {row.winner} · gap {row.gap} · expanded {row.expanded.overall} ·
                baseline {row.baseline.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
