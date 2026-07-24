"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, TripBrief } from "@/store";

export default function ComparePage() {
  const [trips, setTrips] = useState<TripBrief[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [tripId, setTripId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const t = await api<{ items: TripBrief[] }>("/api/trips");
      setTrips(t.items);
      if (!tripId && t.items[0]) setTripId(t.items[0].id);
      const res = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(res.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    start(async () => {
      try {
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({ tripId, name }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Feasibility-first Plan→Learn→Adapt quality vs desire-first baselines that skip hard constraints."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Trip</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Label</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional compare label"
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={run} disabled={pending || !tripId}>
            Run dual score
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <p className="font-medium text-slate-900">{c.name}</p>
            <p className="mt-1 text-sm text-slate-500">Winner: {c.winner}</p>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-md bg-[var(--studio-teal-soft)] p-3">
                <p className="font-medium text-slate-900">
                  A · Feasibility-first
                </p>
                <p>Overall {c.plaFeasibility.overall}</p>
                <p>Feasibility {c.plaFeasibility.feasibility}</p>
                <p>Desire fit {c.plaFeasibility.desireFit}</p>
              </div>
              <div className="rounded-md bg-[var(--studio-dusk-soft)] p-3">
                <p className="font-medium text-slate-900">B · Desire-first</p>
                <p>Overall {c.desireFirst.overall}</p>
                <p>Feasibility {c.desireFirst.feasibility}</p>
                <p>Desire fit {c.desireFirst.desireFit}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
