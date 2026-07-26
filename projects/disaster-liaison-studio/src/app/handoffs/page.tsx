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
  pediatricLoad: number;
  handoffLatency: number;
  status: string;
};

export function HandoffsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [eventId, setEventId] = useState("event-demo");
  const [liaisonId, setLiaisonId] = useState("liaison-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("specialty_to_hq");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/handoffs")).items);
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
      await api("/api/handoffs", {
        method: "POST",
        body: JSON.stringify({
          packId,
          eventId,
          liaisonId,
          label,
          kind,
          pediatricLoad: 0.3,
          handoffLatency: 0.28,
          perinatalRisk: 0.22,
          assaySignal: 0.75,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Handoffs"
      subtitle="Record specialty ↔ HQ handoff soft-sims — latency and pediatric load for dual compare."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="eventId">Event id</Label>
          <Input id="eventId" value={eventId} onChange={(e) => setEventId(e.target.value)} required />
          <Label htmlFor="liaisonId">Liaison id</Label>
          <Input id="liaisonId" value={liaisonId} onChange={(e) => setLiaisonId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Button type="submit">Create handoff</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · load {row.pediatricLoad} · latency {row.handoffLatency} · {row.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default HandoffsPage;
