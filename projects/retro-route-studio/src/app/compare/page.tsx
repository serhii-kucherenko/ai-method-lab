"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Route = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  structured: { overall: number };
  naive: { overall: number };
};

export default function ComparePage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [packId, setPackId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [name, setName] = useState("Memory vs naive");
  const [error, setError] = useState("");

  async function load() {
    const [p, r, c] = await Promise.all([
      api<{ items: Pack[] }>("/api/packs"),
      api<{ items: Route[] }>("/api/routes"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setPacks(p.items);
    setRoutes(r.items);
    setItems(c.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
    if (!routeId && r.items[0]) setRouteId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, packId, routeId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Dual compare"
      subtitle="Structured-memory agentic (A) vs naive local greedy search (B)."
    >
      {!packs.length || !routes.length ? (
        <p className="mb-4 text-sm text-slate-500">
          Need a pack and route —{" "}
          <Link className="underline" href="/packs">
            packs
          </Link>{" "}
          /{" "}
          <Link className="underline" href="/routes">
            routes
          </Link>
          .
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="flex items-end">
          <Button className="bg-[var(--studio-teal)]" onClick={run}>
            Run A vs B
          </Button>
        </div>
      </div>
      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <strong>{c.name}</strong>
              <span>
                winner: {c.winner} · gap {c.gap}
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                A structured {c.structured.overall}
                <div className="mt-1 h-2 rounded bg-slate-200">
                  <div
                    className="score-bar h-2 rounded bg-[var(--studio-teal)]"
                    style={{ width: `${c.structured.overall}%` }}
                  />
                </div>
              </div>
              <div>
                B naive {c.naive.overall}
                <div className="mt-1 h-2 rounded bg-slate-200">
                  <div
                    className="score-bar h-2 rounded bg-[var(--studio-amber)]"
                    style={{ width: `${c.naive.overall}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
