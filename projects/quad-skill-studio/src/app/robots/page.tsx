"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { QuadRobot, RobotPlatform } from "@/store";

const PLATFORMS: RobotPlatform[] = [
  "lab_quad",
  "field_quad",
  "scout_mini",
  "heavy_pack",
];

export default function RobotsPage() {
  const [items, setItems] = useState<QuadRobot[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<RobotPlatform>("field_quad");
  const [massKg, setMassKg] = useState("28");
  const [legLengthMm, setLegLengthMm] = useState("340");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: QuadRobot[] }>(
      `/api/robots?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/robots", {
        method: "POST",
        body: JSON.stringify({
          name,
          platform,
          massKg: Number(massKg),
          legLengthMm: Number(legLengthMm),
          notes: "Registered from robots page",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Quadruped robots"
      subtitle="Register the robots you train for wild terrain — mass and leg geometry first."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm platform mass, leg length, and that this studio
            is a locomotion planner — not live robot control or field
            deployment.
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
      >
        <Input
          placeholder="Robot name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as RobotPlatform)}
        >
          {PLATFORMS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          placeholder="Mass kg"
          value={massKg}
          onChange={(e) => setMassKg(e.target.value)}
          required
        />
        <Input
          placeholder="Leg length mm"
          value={legLengthMm}
          onChange={(e) => setLegLengthMm(e.target.value)}
          required
        />
        <Button type="submit">Add robot</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search robots"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium text-stone-900">{r.name}</div>
            <div className="mt-1 text-sm text-stone-500">
              {r.platform} · {r.massKg} kg · {r.legLengthMm} mm legs
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
