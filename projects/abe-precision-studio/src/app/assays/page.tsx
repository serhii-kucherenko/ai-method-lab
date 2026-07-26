"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Row = {
  id: string;
  label: string;
  kind: string;
  windowNarrowing: number;
  baselineWindowBreadth: number;
  status: string;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [editors, setEditors] = useState<Opt[]>([]);
  const [insertions, setInsertions] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [editorId, setEditorId] = useState("");
  const [insertionId, setInsertionId] = useState("");
  const [label, setLabel] = useState("");
  const [narrow, setNarrow] = useState("0.55");
  const [breadth, setBreadth] = useState("0.35");

  const load = async () => {
    try {
      const [p, e, i, a] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/editors"),
        api<{ items: Opt[] }>("/api/insertions"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setEditors(e.items);
      setInsertions(i.items);
      setItems(a.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!editorId && e.items[0]) setEditorId(e.items[0].id);
      if (!insertionId && i.items[0]) setInsertionId(i.items[0].id);
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
          editorId,
          insertionId,
          label,
          kind: "window_precision",
          windowNarrowing: Number(narrow),
          baselineWindowBreadth: Number(breadth),
          assayFidelity: 0.7,
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
      subtitle="Record precision assay runs tied to editors and insertions."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
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
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="narrow">Window narrowing</Label>
          <Input id="narrow" value={narrow} onChange={(e) => setNarrow(e.target.value)} />
          <Label htmlFor="breadth">Baseline window breadth</Label>
          <Input id="breadth" value={breadth} onChange={(e) => setBreadth(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · narrow {row.windowNarrowing} · breadth {row.baselineWindowBreadth} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
