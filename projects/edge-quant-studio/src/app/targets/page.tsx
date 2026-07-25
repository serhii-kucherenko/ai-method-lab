"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CpuClass, EdgeTarget } from "@/store";

const CLASSES: CpuClass[] = ["workstation", "laptop", "mobile"];

export default function TargetsPage() {
  const [items, setItems] = useState<EdgeTarget[]>([]);
  const [name, setName] = useState("");
  const [cpuClass, setCpuClass] = useState<CpuClass>("laptop");
  const [memoryMb, setMemoryMb] = useState("8192");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: EdgeTarget[] }>("/api/targets");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/targets", {
        method: "POST",
        body: JSON.stringify({
          name,
          cpuClass,
          memoryMb: Number(memoryMb),
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
      title="Edge CPU targets"
      subtitle="Workstation, laptop, and mobile profiles with memory envelopes and LUT affinity."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Target name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={cpuClass}
          onChange={(e) => setCpuClass(e.target.value as CpuClass)}
        >
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Input
          placeholder="Memory MB"
          value={memoryMb}
          onChange={(e) => setMemoryMb(e.target.value)}
        />
        <Button type="submit" className="md:col-span-3">
          Add target
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {t.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {t.cpuClass}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {t.memoryMb} MB · LUT {t.lutAffinity.toFixed(2)} · SIMD{" "}
              {t.simdWidth}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-slate-500">Add a first edge target.</li>
        ) : null}
      </ul>
    </StudioShell>
  );
}
