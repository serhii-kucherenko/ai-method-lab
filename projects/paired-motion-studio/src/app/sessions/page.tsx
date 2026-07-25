"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Session = {
  id: string;
  label: string;
  captureChannel: string;
  lockCondition: string;
  status: string;
};

export function SessionsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Session[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [sessionNotes, setNotes] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [p, s] = await Promise.all([
        api<{ items: Pack[] }>("/api/captures"),
        api<{ items: Session[] }>(
          `/api/sessions?q=${encodeURIComponent(query)}`,
        ),
      ]);
      setPacks(p.items);
      setItems(s.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load sessions");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          sessionNotes,
          lockCondition: "lock_soft_sim",
          captureChannel: "soft_sim_distributed_ego_exo",
        }),
      });
      setLabel("");
      setNotes("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create session");
    }
  };

  return (
    <StudioShell
      title="Sessions"
      subtitle="Open paired capture sessions and set lock conditions."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select
            className="w-full rounded-md border p-2"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="notes">Session notes</Label>
          <Input
            id="notes"
            value={sessionNotes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <Button>Create session</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search sessions"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sessions"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((s) => (
              <article
                key={s.id}
                className="row-lift rounded-lg border bg-white p-4"
              >
                <h2 className="font-semibold">{s.label}</h2>
                <p className="text-sm text-slate-600">
                  {s.captureChannel} · {s.lockCondition} · {s.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default SessionsPage;
