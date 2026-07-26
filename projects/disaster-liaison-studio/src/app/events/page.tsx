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
  hazardHint: string;
  status: string;
};

export function EventsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("earthquake_surge");
  const [hazardHint, setHazardHint] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/events")).items);
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
      await api("/api/events", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          hazardHint,
          pediatricCeiling: 0.45,
          surgeCeiling: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Events"
      subtitle="Configure disaster event soft-sims — surge ceilings and pediatric load hints. Not live dispatch."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="hazardHint">Hazard hint</Label>
          <Input id="hazardHint" value={hazardHint} onChange={(e) => setHazardHint(e.target.value)} required />
          <Button type="submit">Create event</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.hazardHint} · {row.status} · {row.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default EventsPage;
