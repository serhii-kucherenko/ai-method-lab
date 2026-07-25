"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Signal = {
  id: string;
  label: string;
  signalNotes: string;
  feedChannel: string;
  lockCondition: string;
  status: string;
};

export function SignalsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Signal[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [signalNotes, setNotes] = useState("");
  const [lockCondition, setLock] = useState("lock_soft_sim");
  const [feedChannel, setChannel] = useState("soft_sim_surveillance_feed");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, list] = await Promise.all([
        api<{ items: Pack[] }>("/api/packs"),
        api<{ items: Signal[] }>(
          `/api/signals?q=${encodeURIComponent(q)}`,
        ),
      ]);
      setPacks(p.items);
      setItems(list.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load signals");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/signals", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          signalNotes,
          lockCondition,
          feedChannel,
        }),
      });
      setLabel("");
      setNotes("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create signal");
    }
  };

  return (
    <StudioShell
      title="Signal batches"
      subtitle="Open soft-sim surveillance signal batches before audit runs."
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
          <Label htmlFor="notes">Signal notes</Label>
          <Input
            id="notes"
            value={signalNotes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <Label htmlFor="lock">Lock condition</Label>
          <Input
            id="lock"
            value={lockCondition}
            onChange={(e) => setLock(e.target.value)}
          />
          <Label htmlFor="channel">Feed channel</Label>
          <Input
            id="channel"
            value={feedChannel}
            onChange={(e) => setChannel(e.target.value)}
          />
          <Button>Create signal batch</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search signals"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search signals"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article
                key={row.id}
                className="row-lift rounded-lg border bg-white p-4"
              >
                <h2 className="font-semibold">{row.label}</h2>
                <p className="text-sm text-slate-600">
                  {row.feedChannel} · {row.lockCondition} · {row.status}
                </p>
                <p className="mt-1 text-sm">{row.signalNotes}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default SignalsPage;
