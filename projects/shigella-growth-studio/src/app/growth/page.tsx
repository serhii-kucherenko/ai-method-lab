"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & { kind: string; status: string };

const KINDS = [
  "haz_delta",
  "linear_growth_velocity",
  "wasting_risk",
  "catchup_potential",
  "custom",
] as const;

export function GrowthPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [cohorts, setCohorts] = useState<Ref[]>([]);
  const [episodes, setEpisodes] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [label, setLabel] = useState("HAZ delta soft-sim");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("haz_delta");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, c, e, g] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/cohorts"),
        api<{ items: Ref[] }>("/api/episodes"),
        api<{ items: Row[] }>("/api/growth"),
      ]);
      setPacks(p.items);
      setCohorts(c.items);
      setEpisodes(e.items);
      setItems(g.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
      if (!episodeId && e.items[0]) setEpisodeId(e.items[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/growth", {
        method: "POST",
        body: JSON.stringify({
          packId,
          cohortId,
          episodeId,
          label,
          kind,
          antibioticCoverage: 0.55,
          episodeSeverity: 0.3,
          untreatedDuration: 0.28,
          growthAssaySignal: 0.7,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Growth assays"
      subtitle="Capture HAZ delta, velocity, and wasting-risk signals for growth soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
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
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label>Kind</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <Button type="submit">Create growth assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default GrowthPage;
