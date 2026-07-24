"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { PredictRun, UncertaintyBand } from "@/store";

export default function UncertaintyPage() {
  const [runs, setRuns] = useState<PredictRun[]>([]);
  const [items, setItems] = useState<UncertaintyBand[]>([]);
  const [runId, setRunId] = useState("");
  const [name, setName] = useState("");
  const [lower, setLower] = useState("0.22");
  const [upper, setUpper] = useState("0.61");
  const [coverageTarget, setCoverageTarget] = useState("0.9");
  const [error, setError] = useState("");

  async function load() {
    const [r, b] = await Promise.all([
      api<{ items: PredictRun[] }>("/api/models"),
      api<{ items: UncertaintyBand[] }>(
        `/api/uncertainty${runId ? `?runId=${runId}` : ""}`,
      ),
    ]);
    setRuns(r.items);
    setItems(b.items);
    if (!runId && r.items[0]) setRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/uncertainty", {
        method: "POST",
        body: JSON.stringify({
          runId,
          name,
          lower: Number(lower),
          upper: Number(upper),
          coverageTarget: Number(coverageTarget),
          status: "reviewed",
          notes: "Calibrated band from uncertainty page",
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
      title="Calibrated uncertainty"
      subtitle="Widen risk bands with observed missingness — calibrated coverage instead of overconfident points."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={runId}
          onChange={(e) => setRunId(e.target.value)}
          required
        >
          {runs.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Band name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Lower"
          value={lower}
          onChange={(e) => setLower(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Upper"
          value={upper}
          onChange={(e) => setUpper(e.target.value)}
        />
        <Button type="submit">Add band</Button>
      </form>

      <div className="mb-4">
        <Input
          type="number"
          step="0.01"
          placeholder="Coverage target"
          value={coverageTarget}
          onChange={(e) => setCoverageTarget(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((b) => {
          const width = Math.max(4, Math.round((b.upper - b.lower) * 100));
          return (
            <li
              key={b.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-slate-900">{b.name}</span>
                <span className="text-xs text-slate-500">
                  {b.status} · [{b.lower.toFixed(2)}, {b.upper.toFixed(2)}] ·
                  cover {Math.round(b.coverageTarget * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded bg-slate-200/80">
                <div
                  className="animate-band-widen mx-auto h-full rounded bg-[var(--studio-blue)]"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </StudioShell>
  );
}
