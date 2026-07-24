"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  LegacyDevice,
  PlanKind,
  ScoreMode,
  ValidationRun,
} from "@/store";

export default function RunsPage() {
  const [devices, setDevices] = useState<LegacyDevice[]>([]);
  const [items, setItems] = useState<ValidationRun[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScoreMode>("stage_validated");
  const [plan, setPlan] = useState<PlanKind>("stage_validated");
  const [error, setError] = useState("");

  async function load() {
    const [devs, runs] = await Promise.all([
      api<{ items: LegacyDevice[] }>("/api/devices"),
      api<ValidationRun[]>(
        `/api/runs?deviceId=${encodeURIComponent(deviceId)}`,
      ),
    ]);
    setDevices(devs.items);
    if (!deviceId && devs.items[0]) setDeviceId(devs.items[0].id);
    setItems(runs);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({ deviceId, name, mode, plan }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Validation runs"
      subtitle="All-GPU passes and naive-offload baselines — including OOM outcomes."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        >
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Run name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={mode}
          onChange={(e) => setMode(e.target.value as ScoreMode)}
        >
          <option value="stage_validated">stage_validated</option>
          <option value="naive_offload">naive_offload</option>
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={plan}
          onChange={(e) => setPlan(e.target.value as PlanKind)}
        >
          <option value="stage_validated">stage_validated plan</option>
          <option value="naive_offload">naive_offload plan</option>
        </select>
        <Button type="submit" className="md:col-span-2">
          Start validation run
        </Button>
      </form>

      <div className="mb-4">
        <a
          className="text-sm text-[var(--studio-signal)] underline-offset-2 hover:underline"
          href="/api/export/runs"
        >
          Export runs JSON
        </a>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <div className="flex justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {r.name}
              </p>
              <p className="text-xs uppercase text-slate-500">
                {r.status} · {r.mode}
              </p>
            </div>
            {r.quality ? (
              <p className="mt-1 text-sm text-slate-500">
                Overall {r.quality.overall.toFixed(1)} · VRAM fit{" "}
                {r.quality.vramFit.toFixed(1)} · spill safety{" "}
                {r.quality.spillRisk.toFixed(1)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
