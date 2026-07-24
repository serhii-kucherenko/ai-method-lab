"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, LegacyDevice } from "@/store";

export default function ComparePage() {
  const [devices, setDevices] = useState<LegacyDevice[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [devs, compares] = await Promise.all([
      api<{ items: LegacyDevice[] }>("/api/devices"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ]);
    setDevices(devs.items);
    if (!deviceId && devs.items[0]) setDeviceId(devs.items[0].id);
    setItems(compares.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, deviceId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Plan compare"
      subtitle="A · stage-validated all-GPU quality vs B · naive offload spill / OOM risk."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-3"
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
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit">Run dual score</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-4"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </p>
              <p className="text-xs uppercase text-[var(--studio-signal)]">
                Winner · {c.winner}
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  A · Stage-validated
                </p>
                <p className="mt-1 text-2xl text-[var(--studio-signal)]">
                  {c.stageValidated.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  VRAM {c.stageValidated.vramFit.toFixed(0)} · stage{" "}
                  {c.stageValidated.stagePass.toFixed(0)} · spill safety{" "}
                  {c.stageValidated.spillRisk.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  B · Naive offload
                </p>
                <p className="mt-1 text-2xl text-slate-600">
                  {c.naiveOffload.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  VRAM {c.naiveOffload.vramFit.toFixed(0)} · stage{" "}
                  {c.naiveOffload.stagePass.toFixed(0)} · spill safety{" "}
                  {c.naiveOffload.spillRisk.toFixed(0)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
