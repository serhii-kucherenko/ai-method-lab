"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Actuator = {
  id: string;
  packId: string;
  label: string;
  wallZones: string[];
  wallCoverage: number;
  actuationPriority: number;
  status: string;
};

export default function ActuatorsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Actuator[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [zones, setZones] = useState("lower_wall, upper_wall");
  const [coverage, setCoverage] = useState("0.45");
  const [error, setError] = useState("");

  async function load(query = q) {
    const [p, a] = await Promise.all([
      api<{ items: Pack[] }>("/api/packs"),
      api<{ items: Actuator[] }>(
        `/api/actuators?q=${encodeURIComponent(query)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(a.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/actuators", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled actuator plan",
          wallZones: zones.split(",").map((s) => s.trim()).filter(Boolean),
          wallCoverage: Number(coverage),
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Wall actuators"
      subtitle="Define wall zones and coverage for blowing / suction plans."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search actuator or zone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Channel pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="zones">Wall zones (comma-separated)</Label>
          <Input
            id="zones"
            value={zones}
            onChange={(e) => setZones(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coverage">Wall coverage (0–1)</Label>
          <Input
            id="coverage"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create actuator plan</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No actuator plans yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{a.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                zones: {a.wallZones.join(", ")} · coverage {a.wallCoverage} ·{" "}
                {a.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
