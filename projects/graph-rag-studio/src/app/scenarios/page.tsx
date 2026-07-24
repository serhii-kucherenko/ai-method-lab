"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ScenarioCompare } from "@/store";
import type { GraphInput } from "@/domain/types";

const DEFAULT_INPUT: GraphInput = {
  docs: 30,
  rawMentions: 120,
  uniqueEntities: 70,
  duplicateRate: 0.4,
  weakEdges: 22,
  strongEdges: 48,
  hopDepthUseful: 3,
  queryCoverage: 0.8,
  profile: "compact",
};

export default function ScenariosPage() {
  const [name, setName] = useState("Pharma consolidation proof");
  const [input, setInput] = useState<GraphInput>(DEFAULT_INPUT);
  const [rows, setRows] = useState<ScenarioCompare[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const res = await api<{ scenarios: ScenarioCompare[] }>("/api/scenarios");
        setRows(res.scenarios);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  function run() {
    start(async () => {
      try {
        await api("/api/scenarios", {
          method: "POST",
          body: JSON.stringify({ name, graphInput: input }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "compare failed");
      }
    });
  }

  function exportJson(row: ScenarioCompare) {
    const blob = new Blob([JSON.stringify(row, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scenario-${row.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Scenarios"
      subtitle="Compare multi-step extract+consolidate quality against a single-shot noisy graph build."
    >
      <div className="mb-6 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-5 md:grid-cols-3">
        <div className="space-y-2 md:col-span-3">
          <Label>Scenario name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {(
          [
            ["docs", "docs"],
            ["rawMentions", "raw mentions"],
            ["uniqueEntities", "unique entities"],
            ["duplicateRate", "duplicate rate"],
            ["weakEdges", "weak edges"],
            ["strongEdges", "strong edges"],
            ["hopDepthUseful", "useful hops"],
            ["queryCoverage", "query coverage"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="number"
              step="any"
              value={input[key]}
              onChange={(e) =>
                setInput({ ...input, [key]: Number(e.target.value) })
              }
            />
          </div>
        ))}
        <div className="md:col-span-3">
          <Button disabled={pending} onClick={run}>
            Run compare
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold">{row.name}</h2>
              <Button size="sm" variant="outline" onClick={() => exportJson(row)}>
                Export JSON
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-md bg-teal-50 p-4">
                <p className="text-sm font-semibold text-teal-900">Multi-step</p>
                <p className="mt-1 text-2xl font-medium">{row.multiStep.overall}</p>
                <p className="text-sm text-teal-800">
                  entities {row.multiStep.entitiesKept} · edges{" "}
                  {row.multiStep.edgesKept} · dups removed{" "}
                  {row.multiStep.duplicatesRemoved}
                </p>
              </div>
              <div className="rounded-md bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-800">Single-shot</p>
                <p className="mt-1 text-2xl font-medium">{row.singleShot.overall}</p>
                <p className="text-sm text-slate-600">
                  entities {row.singleShot.entitiesKept} · edges{" "}
                  {row.singleShot.edgesKept} · noise{" "}
                  {row.singleShot.noiseEdges}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Winner: <strong>{row.winner.replace("_", "-")}</strong>
            </p>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
