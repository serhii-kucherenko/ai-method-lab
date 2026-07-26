"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  pediatric: { overall: number };
  genericHq: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Pediatric liaison vs generic HQ");
  const [packId, setPackId] = useState("pack-demo");
  const [eventId, setEventId] = useState("event-demo");
  const [liaisonId, setLiaisonId] = useState("liaison-demo");
  const [handoffId, setHandoffId] = useState("handoff-demo");

  const load = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
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
        body: JSON.stringify({ name, packId, eventId, liaisonId, handoffId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: pediatric_perinatal_liaison vs generic_disaster_hq — soft-sim only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="eventId">Event id</Label>
          <Input id="eventId" value={eventId} onChange={(e) => setEventId(e.target.value)} required />
          <Label htmlFor="liaisonId">Liaison id</Label>
          <Input id="liaisonId" value={liaisonId} onChange={(e) => setLiaisonId(e.target.value)} required />
          <Label htmlFor="handoffId">Handoff id</Label>
          <Input id="handoffId" value={handoffId} onChange={(e) => setHandoffId(e.target.value)} required />
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {row.winner} · gap {row.gap} · liaison {row.pediatric.overall} ·
                HQ {row.genericHq.overall}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
