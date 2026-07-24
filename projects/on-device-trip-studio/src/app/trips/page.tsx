"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { TripBrief } from "@/store";

export default function TripsPage() {
  const [items, setItems] = useState<TripBrief[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("leisure");
  const [tripHours, setTripHours] = useState("48");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(query = q) {
    start(async () => {
      const res = await api<{ items: TripBrief[] }>(
        `/api/trips?q=${encodeURIComponent(query)}`,
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
        await api("/api/trips", {
          method: "POST",
          body: JSON.stringify({
            name,
            destination,
            purpose,
            tripHours: Number(tripHours),
          }),
        });
        setName("");
        setDestination("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Trip briefs"
      subtitle="Register destinations and duration before encoding constraints and desires."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-white p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Create a trip brief</li>
          <li>Add hard constraints on the Constraints page</li>
          <li>Capture desires, then draft a feasible plan and adapt</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search trips"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => load()} disabled={pending}>
          Search
        </Button>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Destination</Label>
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div>
          <Label>Purpose</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="leisure">leisure</option>
            <option value="business">business</option>
            <option value="adventure">adventure</option>
            <option value="family">family</option>
          </select>
        </div>
        <div>
          <Label>Trip hours</Label>
          <Input
            value={tripHours}
            onChange={(e) => setTripHours(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !destination}>
            Add trip
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{t.name}</p>
            <p className="text-sm text-slate-500">
              {t.destination} · {t.purpose} · {t.tripHours}h
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
