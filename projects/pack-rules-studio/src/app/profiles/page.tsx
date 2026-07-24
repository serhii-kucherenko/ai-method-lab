"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { TravelerProfile } from "@/store";

export default function ProfilesPage() {
  const [items, setItems] = useState<TravelerProfile[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("leisure");
  const [tripDays, setTripDays] = useState("5");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(query = q) {
    start(async () => {
      const res = await api<{ items: TravelerProfile[] }>(
        `/api/profiles?q=${encodeURIComponent(query)}`,
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
        await api("/api/profiles", {
          method: "POST",
          body: JSON.stringify({
            name,
            destination,
            purpose,
            tripDays: Number(tripDays),
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
      title="Traveler profiles"
      subtitle="Register trips before attaching hard rules and soft preferences."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-white p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Create a traveler profile for the trip</li>
          <li>Add hard rules on the Rules page</li>
          <li>Capture soft prefs, then generate a checklist</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search profiles"
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
          <Label>Trip days</Label>
          <Input
            value={tripDays}
            onChange={(e) => setTripDays(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !destination}>
            Add profile
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{p.name}</p>
            <p className="text-sm text-slate-500">
              {p.destination} · {p.purpose} · {p.tripDays} days
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
