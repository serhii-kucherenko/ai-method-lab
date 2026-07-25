"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Trajectory = {
  id: string;
  label: string;
  trajectoryText: string;
  successCondition: string;
  trajectoryChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function TrajectoriesPage() {
  const [items, setItems] = useState<Trajectory[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Reactive bond-break trajectory gate");
  const [trajectoryText, setTrajectoryText] = useState(
    "Catch reactive bond events with FM atomistics before classical FF misses them.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [trajectoryChannel, setTrajectoryChannel] = useState(
    "soft_sim_reactive",
  );
  const [error, setError] = useState("");

  async function load() {
    const [trajectories, ps] = await Promise.all([
      api<{ items: Trajectory[] }>("/api/trajectories"),
      api<{ items: Pack[] }>("/api/sims"),
    ]);
    setItems(trajectories.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/trajectories", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          trajectoryText,
          successCondition,
          trajectoryChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Trajectories"
      subtitle="Reactive trajectory gates for soft-sim pack locking."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Sim pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
        <div className="md:col-span-2">
          <Label htmlFor="text">Trajectory text</Label>
          <Input
            id="text"
            value={trajectoryText}
            onChange={(e) => setTrajectoryText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Trajectory channel</Label>
          <Input
            id="channel"
            value={trajectoryChannel}
            onChange={(e) => setTrajectoryChannel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create trajectory</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.trajectoryChannel} · {s.successCondition} · {s.status}
            </div>
            <p className="mt-1 text-sm">{s.trajectoryText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
