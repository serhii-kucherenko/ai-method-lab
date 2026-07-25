"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function SurveysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState("conjoint");
  const [instrumentHint, setInstrumentHint] = useState("conjoint,safety_vs_innovation");
  const [itemCount, setItemCount] = useState(12);
  const [responseFloor, setResponseFloor] = useState(0.35);
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/surveys?q=${encodeURIComponent(query)}`,
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
      await api("/api/surveys", {
        method: "POST",
        body: JSON.stringify({ packId, label, mode, instrumentHint, itemCount, responseFloor }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/surveys", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Survey batches" subtitle="Conjoint / ranking soft-sim instruments — not certified fieldwork.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input
            id="packId"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
            required
          />
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="mode">Mode</Label>
          <Input
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            required
          />
          <Label htmlFor="instrumentHint">Instrument hint</Label>
          <Input
            id="instrumentHint"
            value={instrumentHint}
            onChange={(e) => setInstrumentHint(e.target.value)}
            required
          />
          <Label htmlFor="itemCount">Items</Label>
          <Input
            id="itemCount"
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            required
          />
          <Label htmlFor="responseFloor">Response floor</Label>
          <Input
            id="responseFloor"
            value={responseFloor}
            onChange={(e) => setResponseFloor(Number(e.target.value))}
            required
          />
          <Button>Create survey</Button>
          <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">Not the authors’ survey brand.</p>
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
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Survey · {row.status}</p>
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

export default SurveysPage;
