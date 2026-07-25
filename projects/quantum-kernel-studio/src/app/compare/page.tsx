"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  quantumMultiKernel: { overall: number };
  classicalKernel: { overall: number };
};

export default function ComparePage() {
  const [targets, setTargets] = useState<Entity[]>([]);
  const [kernels, setKernels] = useState<Entity[]>([]);
  const [runs, setRuns] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Quantum vs classical compare");
  const [targetId, setTargetId] = useState("");
  const [kernelId, setKernelId] = useState("");
  const [qsarRunId, setQsarRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, a, r, c] = await Promise.all([
      api<{ items: Entity[] }>("/api/targets"),
      api<{ items: Entity[] }>("/api/kernels"),
      api<{ items: Entity[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setTargets(s.items);
    setKernels(a.items);
    setRuns(r.items);
    setItems(c.items);
    if (!targetId && s.items[0]) setTargetId(s.items[0].id);
    if (!kernelId && a.items[0]) setKernelId(a.items[0].id);
    if (!qsarRunId && r.items[0]) setQsarRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          targetId,
          kernelId,
          qsarRunId,
          bias: "balanced",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Quantum multiple-kernel QSAR vs classical kernel baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="target">Target case</Label>
          <select
            id="target"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="kernel">Kernel config</Label>
          <select
            id="kernel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={kernelId}
            onChange={(e) => setKernelId(e.target.value)}
          >
            {kernels.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label ?? a.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">QSAR run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={qsarRunId}
            onChange={(e) => setQsarRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No compares yet — run one above.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>
                  <div className="text-xs text-slate-500">
                    Quantum multi-kernel
                  </div>
                  <div className="mt-1 h-2 rounded bg-slate-100">
                    <div
                      className="score-bar h-2 rounded bg-[var(--studio-lime)]"
                      style={{ width: `${c.quantumMultiKernel.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.quantumMultiKernel.overall}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Classical kernel</div>
                  <div className="mt-1 h-2 rounded bg-slate-100">
                    <div
                      className="score-bar h-2 rounded bg-slate-400"
                      style={{ width: `${c.classicalKernel.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">{c.classicalKernel.overall}</div>
                </div>
                <div className="text-sm text-slate-600">
                  winner <strong>{c.winner}</strong> · gap {c.gap}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
