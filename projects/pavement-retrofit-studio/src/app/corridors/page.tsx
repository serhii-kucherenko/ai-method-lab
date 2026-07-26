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
  routeHint: string;
  status: string;
  trafficCeiling: number;
  exposureFloor: number;
};

export function CorridorsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("urban_arterial");
  const [routeHint, setRouteHint] = useState("");
  const [trafficCeiling, setTrafficCeiling] = useState("0.45");
  const [exposureFloor, setExposureFloor] = useState("0.4");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/corridors")).items);
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
      await api("/api/corridors", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          routeHint,
          trafficCeiling: Number(trafficCeiling),
          exposureFloor: Number(exposureFloor),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/corridors", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Corridors"
      subtitle="Capture route hints, traffic ceilings, and exposure floors for soft-sim corridors."
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
          <Label htmlFor="routeHint">Route hint</Label>
          <Input id="routeHint" value={routeHint} onChange={(e) => setRouteHint(e.target.value)} required />
          <Label htmlFor="traffic">Traffic ceiling</Label>
          <Input id="traffic" value={trafficCeiling} onChange={(e) => setTrafficCeiling(e.target.value)} required />
          <Label htmlFor="exposure">Exposure floor</Label>
          <Input id="exposure" value={exposureFloor} onChange={(e) => setExposureFloor(e.target.value)} required />
          <Button type="submit">Create corridor</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {row.kind} · {row.routeHint} · traffic {row.trafficCeiling} · exposure {row.exposureFloor} · {row.status}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                Archive
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default CorridorsPage;
