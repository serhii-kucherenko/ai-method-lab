"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { AdaptPass, TripBrief } from "@/store";

export default function AdaptPage() {
  const [trips, setTrips] = useState<TripBrief[]>([]);
  const [items, setItems] = useState<AdaptPass[]>([]);
  const [tripId, setTripId] = useState("");
  const [name, setName] = useState("");
  const [desireLift, setDesireLift] = useState("0.1");
  const [feasibilityHold, setFeasibilityHold] = useState("0.95");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const t = await api<{ items: TripBrief[] }>("/api/trips");
      setTrips(t.items);
      if (!tripId && t.items[0]) setTripId(t.items[0].id);
      const tid = tripId || t.items[0]?.id || "";
      const res = await api<{ items: AdaptPass[] }>(
        `/api/adapt?tripId=${encodeURIComponent(tid)}`,
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
        await api("/api/adapt", {
          method: "POST",
          body: JSON.stringify({
            tripId,
            name,
            desireLift: Number(desireLift),
            feasibilityHold: Number(feasibilityHold),
            status: "done",
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
      title="Learn + adapt"
      subtitle="Lift desire fit while holding feasibility — Plan→Learn→Adapt passes."
    >
      <div className="mb-6">
        <Label>Trip</Label>
        <select
          className="mt-1 flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 text-sm"
          value={tripId}
          onChange={(e) => {
            setTripId(e.target.value);
            start(async () => {
              const res = await api<{ items: AdaptPass[] }>(
                `/api/adapt?tripId=${encodeURIComponent(e.target.value)}`,
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
        <div className="md:col-span-2">
          <Label>Pass name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Desire lift</Label>
          <Input
            value={desireLift}
            onChange={(e) => setDesireLift(e.target.value)}
          />
        </div>
        <div>
          <Label>Feasibility hold</Label>
          <Input
            value={feasibilityHold}
            onChange={(e) => setFeasibilityHold(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !tripId}>
            Run adapt pass
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((a) => (
          <li
            key={a.id}
            className="animate-adapt-morph rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{a.name}</p>
            <p className="text-sm text-slate-500">
              {a.status} · lift {a.desireLift} · hold {a.feasibilityHold}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
