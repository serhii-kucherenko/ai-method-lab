"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Row = {
  id: string;
  label: string;
  kind: string;
  locusHint: string;
  status: string;
};

export function EditorsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("therapeutic_candidate");
  const [locusHint, setLocusHint] = useState("");
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const p = await api<{ items: Pack[] }>("/api/packs");
      setPacks(p.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      const b = await api<{ items: Row[] }>(
        `/api/editors?q=${encodeURIComponent(q)}`,
      );
      setItems(b.items);
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
      await api("/api/editors", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          locusHint,
          insertionFloor: 0.45,
          fidelityFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Editors"
      subtitle="Register recorded adenine base editor soft-sim panels linked to an editor pack."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
            required
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="abe8e_like">ABE8e-like</option>
            <option value="tadabe_like">TadABE-like</option>
            <option value="therapeutic_candidate">Therapeutic candidate</option>
            <option value="research_panel">Research panel</option>
            <option value="composite_cohort">Composite cohort</option>
            <option value="custom">Custom</option>
          </select>
          <Label htmlFor="locus">Locus hint</Label>
          <Input id="locus" value={locusHint} onChange={(e) => setLocusHint(e.target.value)} required />
          <Button type="submit">Create editor</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {row.kind} · {row.locusHint} · {row.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default EditorsPage;
