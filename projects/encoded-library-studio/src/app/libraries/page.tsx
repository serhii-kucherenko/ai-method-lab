"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function LibrariesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [scaffoldHint, setScaffoldHint] = useState("macrocycle,dna-tag");
  const [memberCount, setMemberCount] = useState("10000");
  const [diversityFloor, setDiversityFloor] = useState("0.35");


  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(`/api/libraries?q=${encodeURIComponent(query)}`)).items,
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
      await api("/api/libraries", {
        method: "POST",
        body: JSON.stringify({
          label,
          scaffoldHint,
          memberCount: Number(memberCount),
          diversityFloor: Number(diversityFloor),
          kind: "macrocyclic",
          packId: "pack-demo",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/libraries", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Libraries" subtitle="Register DNA-encoded library scaffolds and diversity floors for soft-sim.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="scaffoldHint">Scaffold hint</Label>
          <Input id="scaffoldHint" value={scaffoldHint} onChange={(e) => setScaffoldHint(e.target.value)} required />
          <Label htmlFor="memberCount">Member count</Label>
          <Input id="memberCount" value={memberCount} onChange={(e) => setMemberCount(e.target.value)} required />
          <Label htmlFor="diversityFloor">Diversity floor</Label>
          <Input id="diversityFloor" value={diversityFloor} onChange={(e) => setDiversityFloor(e.target.value)} required />
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
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Encoded library · {row.status}</p>
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

export default LibrariesPage;
