"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & { kind: string; siteHint: string; status: string };

export function ExamsPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [siteHint, setSiteHint] = useState("site-pocus");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, e] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Row[] }>(`/api/exams?q=${encodeURIComponent(q)}`),
      ]);
      setPacks(p.items);
      setItems(e.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
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
      await api("/api/exams", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "mixed_cardiac",
          siteHint,
          viewFloor: 0.45,
          probeFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Exams"
      subtitle="Configure cardiac window exams — parasternal, apical, subcostal — for soft-sim COPD POCUS packs."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Exam label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="site">Site hint</Label>
          <Input id="site" value={siteHint} onChange={(e) => setSiteHint(e.target.value)} required />
          <Button type="submit">Create exam</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>Search</Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {row.kind} · {row.siteHint} · {row.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default ExamsPage;
