"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function HitshortlistsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [filterHint, setFilterHint] = useState("enrichment,diversity");
  const [hitCount, setHitCount] = useState("48");
  const [precisionFloor, setPrecisionFloor] = useState("0.35");


  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(`/api/hits?q=${encodeURIComponent(query)}`)).items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/hits", {
        method: "POST",
        body: JSON.stringify({
          label,
          filterHint,
          hitCount: Number(hitCount),
          precisionFloor: Number(precisionFloor),
          kind: "macrocycle_fit",
          packId: "pack-demo",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/hits", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Hit shortlists" subtitle="Filter hit shortlists with precision floors — soft-sim only, not clinical nomination.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="filterHint">Filter hint</Label>
          <Input id="filterHint" value={filterHint} onChange={(e) => setFilterHint(e.target.value)} required />
          <Label htmlFor="hitCount">Hit count</Label>
          <Input id="hitCount" value={hitCount} onChange={(e) => setHitCount(e.target.value)} required />
          <Label htmlFor="precisionFloor">Precision floor</Label>
          <Input id="precisionFloor" value={precisionFloor} onChange={(e) => setPrecisionFloor(e.target.value)} required />
          <Button>Create</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Hit shortlist · {row.status}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default HitshortlistsPage;
