"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Route = { id: string; label: string };
type Cell = {
  id: string;
  triedPathHash: string;
  outcome: string;
  notes: string;
};

export default function MemoryPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [items, setItems] = useState<Cell[]>([]);
  const [packId, setPackId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [triedPathHash, setTriedPathHash] = useState("");
  const [outcome, setOutcome] = useState("promising");
  const [error, setError] = useState("");

  async function load() {
    const [p, r, m] = await Promise.all([
      api<{ items: Pack[] }>("/api/packs"),
      api<{ items: Route[] }>("/api/routes"),
      api<{ items: Cell[] }>("/api/memory"),
    ]);
    setPacks(p.items);
    setRoutes(r.items);
    setItems(m.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
    if (!routeId && r.items[0]) setRouteId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/memory", {
        method: "POST",
        body: JSON.stringify({
          packId,
          routeId: routeId || undefined,
          triedPathHash: triedPathHash || `ph_${Date.now()}`,
          outcome,
          notes: "",
        }),
      });
      setTriedPathHash("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Search memory"
      subtitle="Structured search-memory board — tried paths, outcomes, and linked intermediates."
    >
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          No tried paths yet — record one below.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="route">Route</Label>
          <select
            id="route"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="hash">Tried path hash</Label>
          <Input
            id="hash"
            value={triedPathHash}
            onChange={(e) => setTriedPathHash(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="out">Outcome</Label>
          <select
            id="out"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
          >
            <option value="promising">promising</option>
            <option value="dead_end">dead_end</option>
            <option value="solved">solved</option>
          </select>
        </div>
      </div>
      <Button className="mb-6 bg-[var(--studio-teal)]" onClick={create}>
        Record memory cell
      </Button>
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <strong>{c.triedPathHash}</strong> · {c.outcome}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
