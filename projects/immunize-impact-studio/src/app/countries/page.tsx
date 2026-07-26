"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  kind: string;
  regionHint: string;
  status: string;
  packId: string;
};

export function Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("kenya");
  const [regionHint, setRegionHint] = useState("ssa-east");
  const [packId, setPackId] = useState("pack-demo");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/countries?q=${encodeURIComponent(query)}`,
          )
        ).items,
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
      await api("/api/countries", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          regionHint,
          coverageFloor: 0.5,
          equityCeiling: 0.35,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Country panels"
      subtitle="Configure Sub-Saharan Africa country panels that feed immunization-linked mortality soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Country kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="region">Region hint</Label>
          <Input id="region" value={regionHint} onChange={(e) => setRegionHint(e.target.value)} required />
          <Button type="submit">Add country</Button>
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
                  {row.kind} · {row.regionHint} · {row.status} · {row.id}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default Page;
