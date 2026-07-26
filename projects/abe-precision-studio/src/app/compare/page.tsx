"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  insertion: { overall: number };
  baseline: { overall: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [editors, setEditors] = useState<Opt[]>([]);
  const [insertions, setInsertions] = useState<Opt[]>([]);
  const [assays, setAssays] = useState<Opt[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Domain-insertion vs baseline ABE");
  const [packId, setPackId] = useState("");
  const [editorId, setEditorId] = useState("");
  const [insertionId, setInsertionId] = useState("");
  const [assayId, setAssayId] = useState("");

  const load = async () => {
    try {
      const [p, e, i, a, c] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/editors"),
        api<{ items: Opt[] }>("/api/insertions"),
        api<{ items: Opt[] }>("/api/assays"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(p.items);
      setEditors(e.items);
      setInsertions(i.items);
      setAssays(a.items);
      setCompares(c.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!editorId && e.items[0]) setEditorId(e.items[0].id);
      if (!insertionId && i.items[0]) setInsertionId(i.items[0].id);
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
        body: JSON.stringify({ name, packId, editorId, insertionId, assayId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Run domain_insertion_abe against baseline_abe and lock only when deltas and honesty are clear."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)} required>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="editor">Editor</Label>
          <select id="editor" className="w-full rounded-md border px-3 py-2 text-sm" value={editorId} onChange={(e) => setEditorId(e.target.value)} required>
            {editors.map((ed) => (
              <option key={ed.id} value={ed.id}>{ed.label}</option>
            ))}
          </select>
          <Label htmlFor="insertion">Insertion</Label>
          <select id="insertion" className="w-full rounded-md border px-3 py-2 text-sm" value={insertionId} onChange={(e) => setInsertionId(e.target.value)} required>
            {insertions.map((ins) => (
              <option key={ins.id} value={ins.id}>{ins.label}</option>
            ))}
          </select>
          <Label htmlFor="assay">Assay</Label>
          <select id="assay" className="w-full rounded-md border px-3 py-2 text-sm" value={assayId} onChange={(e) => setAssayId(e.target.value)} required>
            {assays.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {compares.map((c) => (
            <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                winner {c.winner} · gap {c.gap} · insertion {c.insertion.overall} · baseline {c.baseline.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
