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
  cardiac: { overall: number };
  lung: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [exams, setExams] = useState<Ref[]>([]);
  const [patterns, setPatterns] = useState<Ref[]>([]);
  const [assays, setAssays] = useState<Ref[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [name, setName] = useState("POCUS A/B soft-sim");
  const [packId, setPackId] = useState("");
  const [examId, setExamId] = useState("");
  const [patternId, setPatternId] = useState("");
  const [assayId, setAssayId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, e, pat, a, cmp] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/exams"),
        api<{ items: Ref[] }>("/api/patterns"),
        api<{ items: Ref[] }>("/api/assays"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setExams(e.items);
      setPatterns(pat.items);
      setAssays(a.items);
      setCompares(cmp.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!examId && e.items[0]) setExamId(e.items[0].id);
      if (!patternId && pat.items[0]) setPatternId(pat.items[0].id);
      if (!assayId && a.items[0]) setAssayId(a.items[0].id);
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
          examId,
          patternId,
          assayId,
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
      subtitle="Run cardiac_pocus_copd against lung_ultrasound_baseline soft-sims and inspect the gap."
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
          <Label>Exam</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={examId} onChange={(e) => setExamId(e.target.value)}>
            {exams.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <Label>Pattern</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={patternId} onChange={(e) => setPatternId(e.target.value)}>
            {patterns.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <Label>Assay</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={assayId} onChange={(e) => setAssayId(e.target.value)}>
            {assays.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {compares.map((c) => (
            <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {c.winner} · gap {c.gap} · cardiac {c.cardiac.overall} vs lung {c.lung.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
