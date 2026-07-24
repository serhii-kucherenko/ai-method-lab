"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { KernelNote, KernelOp, LegacyDevice } from "@/store";

const OPS: KernelOp[] = [
  "sgemm",
  "delta_scan",
  "attention",
  "dequant",
  "vision_attn",
];

export default function KernelsPage() {
  const [devices, setDevices] = useState<LegacyDevice[]>([]);
  const [items, setItems] = useState<KernelNote[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [op, setOp] = useState<KernelOp>("sgemm");
  const [rewrite, setRewrite] = useState("");
  const [speedup, setSpeedup] = useState("2.8");
  const [error, setError] = useState("");

  async function load() {
    const [devs, kernels] = await Promise.all([
      api<{ items: LegacyDevice[] }>("/api/devices"),
      api<KernelNote[]>(
        `/api/kernels?deviceId=${encodeURIComponent(deviceId)}`,
      ),
    ]);
    setDevices(devs.items);
    if (!deviceId && devs.items[0]) setDeviceId(devs.items[0].id);
    setItems(kernels);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/kernels", {
        method: "POST",
        body: JSON.stringify({
          deviceId,
          name,
          op,
          rewriteSummary: rewrite,
          speedupHint: Number(speedup),
        }),
      });
      setName("");
      setRewrite("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Kernel notes"
      subtitle="Capture re-engineered ops — dequant+sgemm, chunked scans, attention rewrites."
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
          placeholder="Kernel name"
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
          placeholder="Speedup hint"
          value={speedup}
          onChange={(e) => setSpeedup(e.target.value)}
        />
        <Input
          className="md:col-span-2"
          placeholder="Rewrite summary"
          value={rewrite}
          onChange={(e) => setRewrite(e.target.value)}
          required
        />
        <Button type="submit" className="md:col-span-2">
          Add kernel note
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((k) => (
          <li
            key={k.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <div className="flex justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {k.name}
              </p>
              <p className="text-xs uppercase text-slate-500">
                {k.op} · ×{k.speedupHint}
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-500">{k.rewriteSummary}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
