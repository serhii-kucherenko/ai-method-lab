"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { FeasiblePlan, TripBrief } from "@/store";

export default function PlansPage() {
  const [trips, setTrips] = useState<TripBrief[]>([]);
  const [items, setItems] = useState<FeasiblePlan[]>([]);
  const [tripId, setTripId] = useState("");
  const [name, setName] = useState("");
  const [stopCount, setStopCount] = useState("10");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const t = await api<{ items: TripBrief[] }>("/api/trips");
      setTrips(t.items);
      if (!tripId && t.items[0]) setTripId(t.items[0].id);
      const tid = tripId || t.items[0]?.id || "";
      const res = await api<{ items: FeasiblePlan[] }>(
        `/api/plans?tripId=${encodeURIComponent(tid)}`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/plans", {
          method: "POST",
          body: JSON.stringify({
            tripId,
            name,
            status,
            stopCount: Number(stopCount),
          }),
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
      title="Feasibility-first plans"
      subtitle="Draft itineraries that respect hard constraints before desire adaptation."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <Label>Trip</Label>
          <select
            className="mt-1 flex h-9 w-64 rounded-md border border-input bg-transparent px-3 text-sm"
            value={tripId}
            onChange={(e) => {
              setTripId(e.target.value);
              start(async () => {
                const res = await api<{ items: FeasiblePlan[] }>(
                  `/api/plans?tripId=${encodeURIComponent(e.target.value)}`,
                );
                setItems(res.items);
              });
            }}
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            start(async () => {
              const text = await api<string>(
                `/api/export/plans?tripId=${encodeURIComponent(tripId)}`,
              );
              const blob = new Blob([text], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "plans.json";
              a.click();
              URL.revokeObjectURL(url);
            });
          }}
        >
          Export JSON
        </Button>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Stops</Label>
          <Input
            value={stopCount}
            onChange={(e) => setStopCount(e.target.value)}
          />
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">draft</option>
            <option value="feasible">feasible</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={create} disabled={pending || !name || !tripId}>
            Add plan
          </Button>
        </div>
        {error ? (
          <p className="md:col-span-2 text-sm text-red-600">{error}</p>
        ) : null}
      </div>

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{p.name}</p>
            <p className="text-sm text-slate-500">
              {p.status} · {p.stopCount} stops
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
