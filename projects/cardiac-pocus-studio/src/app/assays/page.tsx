"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & {
  kind: string;
  cardiacPatternSignal: number;
  lungBaselineSignal: number;
  status: string;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [exams, setExams] = useState<Ref[]>([]);
  const [patterns, setPatterns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [examId, setExamId] = useState("");
  const [patternId, setPatternId] = useState("");
  const [label, setLabel] = useState("");
  const [cardiac, setCardiac] = useState("0.55");
  const [lung, setLung] = useState("0.35");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, e, pat, a] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/exams"),
        api<{ items: Ref[] }>("/api/patterns"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setExams(e.items);
      setPatterns(pat.items);
      setItems(a.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!examId && e.items[0]) setExamId(e.items[0].id);
      if (!patternId && pat.items[0]) setPatternId(pat.items[0].id);
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
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          packId,
          examId,
          patternId,
          label,
          kind: "dual_gate_soft_sim",
          cardiacPatternSignal: Number(cardiac),
          lungBaselineSignal: Number(lung),
          probeQuality: 0.7,
          assayReadout: 0.65,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assays"
      subtitle="Run COPD detection assays that capture cardiac pattern and lung-baseline soft-sim signals."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
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
          <Label htmlFor="label">Assay label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="cardiac">Cardiac pattern signal</Label>
          <Input id="cardiac" value={cardiac} onChange={(e) => setCardiac(e.target.value)} />
          <Label htmlFor="lung">Lung baseline signal</Label>
          <Input id="lung" value={lung} onChange={(e) => setLung(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · cardiac {row.cardiacPatternSignal} · lung {row.lungBaselineSignal} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
