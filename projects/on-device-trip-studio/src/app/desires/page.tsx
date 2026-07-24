"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DesireSignal, TripBrief } from "@/store";

export default function DesiresPage() {
  const [trips, setTrips] = useState<TripBrief[]>([]);
  const [items, setItems] = useState<DesireSignal[]>([]);
  const [tripId, setTripId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("food");
  const [weight, setWeight] = useState("0.6");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const t = await api<{ items: TripBrief[] }>("/api/trips");
      setTrips(t.items);
      if (!tripId && t.items[0]) setTripId(t.items[0].id);
      const tid = tripId || t.items[0]?.id || "";
      const res = await api<{ items: DesireSignal[] }>(
        `/api/desires?tripId=${encodeURIComponent(tid)}`,
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
        await api("/api/desires", {
          method: "POST",
          body: JSON.stringify({
            tripId,
            name,
            category,
            weight: Number(weight),
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
      title="Desire signals"
      subtitle="Capture subjective preferences that personalize inside the feasible envelope."
    >
      <div className="mb-6">
        <Label>Trip</Label>
        <select
          className="mt-1 flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 text-sm"
          value={tripId}
          onChange={(e) => {
            setTripId(e.target.value);
            start(async () => {
              const res = await api<{ items: DesireSignal[] }>(
                `/api/desires?tripId=${encodeURIComponent(e.target.value)}`,
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

      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <Label>Weight (0–1)</Label>
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button onClick={create} disabled={pending || !name || !tripId}>
            Add desire
          </Button>
        </div>
        {error ? (
          <p className="md:col-span-2 text-sm text-red-600">{error}</p>
        ) : null}
      </div>

      <ul className="space-y-3">
        {items.map((d) => (
          <li
            key={d.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{d.name}</p>
            <p className="text-sm text-slate-500">
              {d.category} · weight {d.weight}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
