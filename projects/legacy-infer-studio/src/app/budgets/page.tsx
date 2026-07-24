"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { KernelBudget, KernelOp, LegacyDevice } from "@/store";

const OPS: KernelOp[] = [
  "sgemm",
  "delta_scan",
  "attention",
  "dequant",
  "vision_attn",
];

export default function BudgetsPage() {
  const [devices, setDevices] = useState<LegacyDevice[]>([]);
  const [items, setItems] = useState<KernelBudget[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [op, setOp] = useState<KernelOp>("dequant");
  const [vramMb, setVramMb] = useState("2048");
  const [efficiency, setEfficiency] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [devs, budgets] = await Promise.all([
      api<{ items: LegacyDevice[] }>("/api/devices"),
      api<KernelBudget[]>(
        `/api/budgets?deviceId=${encodeURIComponent(deviceId)}`,
      ),
    ]);
    setDevices(devs.items);
    if (!deviceId && devs.items[0]) setDeviceId(devs.items[0].id);
    setItems(budgets);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/budgets", {
        method: "POST",
        body: JSON.stringify({
          deviceId,
          name,
          op,
          vramMb: Number(vramMb),
          efficiency: Number(efficiency),
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
      title="VRAM budgets"
      subtitle="Track kernel and resident footprints against usable device memory."
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
          placeholder="Budget name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={op}
          onChange={(e) => setOp(e.target.value as KernelOp)}
        >
          {OPS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Input
          placeholder="VRAM MB"
          value={vramMb}
          onChange={(e) => setVramMb(e.target.value)}
        />
        <Input
          placeholder="Efficiency 0–1"
          value={efficiency}
          onChange={(e) => setEfficiency(e.target.value)}
        />
        <Button type="submit">Add budget</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((b) => (
          <li
            key={b.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <div className="flex justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {b.name}
              </p>
              <p className="text-xs uppercase text-slate-500">{b.op}</p>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {b.vramMb} MB · efficiency {(b.efficiency * 100).toFixed(0)}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded bg-[var(--studio-signal)] animate-vram-fill"
                style={{
                  ["--vram-w" as string]: `${b.efficiency * 100}%`,
                  width: `${b.efficiency * 100}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
