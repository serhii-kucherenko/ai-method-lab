"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { AgentFleet, CompareResult } from "@/store";
import type { SafetyInput } from "@/domain/types";

function defaultInput(): SafetyInput {
  return {
    cfgDelta: 0.68,
    dfgDelta: 0.62,
    privilegeBroadening: 0.58,
    loggingDegradation: 0.42,
    denyGuardRemoval: 0.5,
    newSensitiveSinks: 0.55,
    taskJustification: 0.32,
    monitorCoverage: 0.8,
    suspicionThreshold: 6,
    codeDiffNoise: 0.4,
    hardeningRegression: 0.48,
    checkKindCount: 7,
    deployMode: "sync",
    profile: "balanced",
  };
}

export default function ComparePage() {
  const [fleets, setFleets] = useState<AgentFleet[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [fleetId, setFleetId] = useState("");
  const [name, setName] = useState("Structural vs threshold");
  const [input, setInput] = useState<SafetyInput>(defaultInput());
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const f = await api<{ items: AgentFleet[] }>(
        "/api/fleets?page=1&pageSize=50",
      );
      setFleets(f.items);
      if (!fleetId && f.items[0]) setFleetId(f.items[0].id);
      const cmp = await api<{ items: CompareResult[] }>("/api/compare");
      setRows(cmp.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    start(async () => {
      try {
        await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({ name, fleetId, safetyInput: input }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  const fields: (keyof SafetyInput)[] = [
    "cfgDelta",
    "dfgDelta",
    "privilegeBroadening",
    "loggingDegradation",
    "denyGuardRemoval",
    "newSensitiveSinks",
    "taskJustification",
    "monitorCoverage",
    "codeDiffNoise",
    "hardeningRegression",
  ];

  return (
    <StudioShell
      title="Structural vs threshold"
      subtitle="Compare graph-delta monitoring plans against unchecked / threshold-only baselines."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Run compare</p>
          <div>
            <Label htmlFor="cmp-name">Name</Label>
            <Input
              id="cmp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cmp-fleet">Fleet</Label>
            <select
              id="cmp-fleet"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={fleetId}
              onChange={(e) => setFleetId(e.target.value)}
            >
              {fleets.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">
            {fields.map((key) => (
              <div key={key}>
                <Label htmlFor={`cmp-${key}`}>{key}</Label>
                <Input
                  id={`cmp-${key}`}
                  value={String(input[key])}
                  onChange={(e) =>
                    setInput({ ...input, [key]: Number(e.target.value) })
                  }
                />
              </div>
            ))}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !fleetId} onClick={run}>
            Compare
          </Button>
        </div>

        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{r.name}</p>
                <Badge>
                  winner: {r.winner === "structural" ? "structural" : r.winner}
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                {(
                  [
                    ["Structural", r.structural.overall],
                    ["Threshold", r.threshold.overall],
                  ] as const
                ).map(([label, score], i) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs text-stone-500">
                      <span>{label}</span>
                      <span>{score}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-stone-100">
                      <div
                        className="animate-bar-grow h-full rounded bg-[var(--studio-amber)]"
                        style={{
                          width: `${Math.min(100, score)}%`,
                          animationDelay: `${i * 100}ms`,
                          opacity: label === "Threshold" ? 0.45 : 1,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-400">
                Catch {r.structural.structuralCatchRate} vs{" "}
                {r.threshold.structuralCatchRate} · sync block{" "}
                {r.structural.syncBlockEffectiveness} vs{" "}
                {r.threshold.syncBlockEffectiveness}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
