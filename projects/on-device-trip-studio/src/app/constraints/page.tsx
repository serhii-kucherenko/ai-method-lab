"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { HardConstraint, TripBrief } from "@/store";

export default function ConstraintsPage() {
  const [trips, setTrips] = useState<TripBrief[]>([]);
  const [items, setItems] = useState<HardConstraint[]>([]);
  const [tripId, setTripId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("resource");
  const [constraint, setConstraint] = useState("");
  const [severity, setSeverity] = useState("0.8");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const t = await api<{ items: TripBrief[] }>("/api/trips");
      setTrips(t.items);
      if (!tripId && t.items[0]) setTripId(t.items[0].id);
      const tid = tripId || t.items[0]?.id || "";
      const res = await api<{ items: HardConstraint[] }>(
        `/api/constraints?tripId=${encodeURIComponent(tid)}`,
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
        await api("/api/constraints", {
          method: "POST",
          body: JSON.stringify({
            tripId,
            name,
            kind,
            constraint,
            severity: Number(severity),
          }),
        });
        setName("");
        setConstraint("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Hard constraints"
      subtitle="Encode schedule, resource, transfer, and offline caps before chasing desires."
    >
      <div className="mb-6">
        <Label>Trip</Label>
        <select
          className="mt-1 flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 text-sm"
          value={tripId}
          onChange={(e) => {
            setTripId(e.target.value);
            start(async () => {
              const res = await api<{ items: HardConstraint[] }>(
                `/api/constraints?tripId=${encodeURIComponent(e.target.value)}`,
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
          <Label>Kind</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="schedule">schedule</option>
            <option value="resource">resource</option>
            <option value="transfer">transfer</option>
            <option value="offline">offline</option>
          </select>
        </div>
        <div>
          <Label>Constraint key</Label>
          <Input
            value={constraint}
            onChange={(e) => setConstraint(e.target.value)}
          />
        </div>
        <div>
          <Label>Severity (0–1)</Label>
          <Input
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button
            onClick={create}
            disabled={pending || !name || !constraint || !tripId}
          >
            Add constraint
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{c.name}</p>
            <p className="text-sm text-slate-500">
              {c.kind} · {c.constraint} · severity {c.severity}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
