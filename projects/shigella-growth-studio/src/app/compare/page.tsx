"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  antibiotic: { overall: number };
  untreated: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [cohorts, setCohorts] = useState<Ref[]>([]);
  const [episodes, setEpisodes] = useState<Ref[]>([]);
  const [growth, setGrowth] = useState<Ref[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [name, setName] = useState("Cohort A/B soft-sim");
  const [packId, setPackId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [growthId, setGrowthId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, c, e, g, cmp] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/cohorts"),
        api<{ items: Ref[] }>("/api/episodes"),
        api<{ items: Ref[] }>("/api/growth"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setCohorts(c.items);
      setEpisodes(e.items);
      setGrowth(g.items);
      setCompares(cmp.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
      if (!episodeId && e.items[0]) setEpisodeId(e.items[0].id);
      if (!growthId && g.items[0]) setGrowthId(g.items[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
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
        body: JSON.stringify({
          name,
          packId,
          cohortId,
          episodeId,
          growthId,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Run antibiotic-treated Shigella against untreated diarrhea growth soft-sims and inspect the gap."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label>Cohort</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <Label>Episode</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={episodeId} onChange={(e) => setEpisodeId(e.target.value)}>
            {episodes.map((ep) => <option key={ep.id} value={ep.id}>{ep.label}</option>)}
          </select>
          <Label>Growth assay</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={growthId} onChange={(e) => setGrowthId(e.target.value)}>
            {growth.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {compares.map((c) => (
            <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {c.winner} · gap {c.gap} · antibiotic {c.antibiotic.overall} vs untreated {c.untreated.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
