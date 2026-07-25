"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Observer = {
  id: string;
  label: string;
  kind: string;
  status: string;
  viewCount: number;
};

const KINDS = ["exo_camera", "room_rig", "multi_view", "custom"] as const;

export function ObserversPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Observer[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("exo_camera");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [p, o] = await Promise.all([
        api<{ items: Pack[] }>("/api/captures"),
        api<{ items: Observer[] }>(
          `/api/observers?q=${encodeURIComponent(query)}`,
        ),
      ]);
      setPacks(p.items);
      setItems(o.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load observers");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/observers", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          exoHint: "exo_coverage",
          viewCount: 2,
          baselineMeters: 3,
        }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create observer");
    }
  };

  return (
    <StudioShell
      title="Observers"
      subtitle="Configure exo cameras and room rigs for paired capture."
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
          <Label>Kind</Label>
          <select
            className="w-full rounded-md border p-2"
            value={kind}
            onChange={(e) =>
              setKind(e.target.value as (typeof KINDS)[number])
            }
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <Button>Create observer</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search observers"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search observers"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((o) => (
              <article
                key={o.id}
                className="row-lift rounded-lg border bg-white p-4"
              >
                <h2 className="font-semibold">{o.label}</h2>
                <p className="text-sm text-slate-600">
                  {o.kind} · {o.viewCount} views · {o.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default ObserversPage;
