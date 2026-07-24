"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ExplanationNote, PredictRun } from "@/store";

export default function ExplanationsPage() {
  const [runs, setRuns] = useState<PredictRun[]>([]);
  const [items, setItems] = useState<ExplanationNote[]>([]);
  const [runId, setRunId] = useState("");
  const [name, setName] = useState("");
  const [salienceFeature, setSalienceFeature] = useState("cognitive_decline");
  const [salienceScore, setSalienceScore] = useState("0.75");
  const [error, setError] = useState("");

  async function load() {
    const [r, e] = await Promise.all([
      api<{ items: PredictRun[] }>("/api/models"),
      api<{ items: ExplanationNote[] }>(
        `/api/explanations${runId ? `?runId=${runId}` : ""}`,
      ),
    ]);
    setRuns(r.items);
    setItems(e.items);
    if (!runId && r.items[0]) setRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/explanations", {
        method: "POST",
        body: JSON.stringify({
          runId,
          name,
          salienceFeature,
          salienceScore: Number(salienceScore),
          notes: "Salience note from explanations page",
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
      title="Explanations"
      subtitle="Feature salience notes under the observed missingness mask — what drives risk when gaps stay visible."
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
          placeholder="Note name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Salience feature"
          value={salienceFeature}
          onChange={(e) => setSalienceFeature(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Score"
          value={salienceScore}
          onChange={(e) => setSalienceScore(e.target.value)}
        />
        <Button type="submit">Add note</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{n.name}</span>
              <span className="text-xs text-slate-500">
                {n.salienceFeature} · {Math.round(n.salienceScore * 100)}%
              </span>
            </div>
            {n.notes ? (
              <p className="mt-1 text-sm text-slate-500">{n.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
