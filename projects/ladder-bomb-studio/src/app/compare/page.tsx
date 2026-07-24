"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, LadderInput, LadderProgram } from "@/store";

function defaultInput(): LadderInput {
  return {
    fbBodyRetention: 0.88,
    nestedFbDepth: 0.62,
    timerCounterComplexity: 0.58,
    interlockBypassRisk: 0.55,
    actuatorReach: 0.6,
    operatorOverrideGap: 0.42,
    hiddenTimerHint: 0.7,
    scanCycleBoundTightness: 0.72,
    symbolicPathCoverage: 0.76,
    triggerRecoverability: 0.74,
    ladderNoise: 0.28,
    fbInstanceCount: 8,
    profile: "balanced",
  };
}

export default function ComparePage() {
  const [programs, setPrograms] = useState<LadderProgram[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [programId, setProgramId] = useState("");
  const [name, setName] = useState("FB-aware vs dropped-FB");
  const [input, setInput] = useState<LadderInput>(defaultInput);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const prog = await api<{ items: LadderProgram[] }>(
        "/api/programs?page=1&pageSize=50",
      );
      setPrograms(prog.items);
      if (prog.items[0]) setProgramId(prog.items[0].id);
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({ name, programId, ladderInput: input }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function setNum(key: keyof LadderInput, value: string) {
    const n = Number(value);
    if (Number.isNaN(n)) return;
    setInput((prev) => ({ ...prev, [key]: n }));
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="FB-aware formal plan quality versus dropped-FB baselines that miss bombs."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run compare</p>
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="c-prog">Program</Label>
            <select
              id="c-prog"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["fbBodyRetention", "FB retention"],
                ["nestedFbDepth", "Nested FB"],
                ["hiddenTimerHint", "Hidden timer"],
                ["triggerRecoverability", "Trigger recover"],
                ["symbolicPathCoverage", "Symbolic cover"],
                ["ladderNoise", "Ladder noise"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={String(input[key])}
                  onChange={(e) => setNum(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !programId || !name.trim()}
            onClick={create}
          >
            Compare plans
          </Button>
        </div>

        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{c.name}</p>
                <Badge>
                  winner: {c.winner === "fb-aware" ? "FB-aware" : c.winner}
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                {(
                  [
                    ["FB-aware overall", c.fbAware.overall],
                    ["Dropped-FB overall", c.droppedFb.overall],
                    ["FB-aware catch", c.fbAware.bombCatchRate],
                    ["Dropped-FB catch", c.droppedFb.bombCatchRate],
                  ] as const
                ).map(([label, pct]) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{label}</span>
                      <span>{pct}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-slate-100">
                      <div
                        className="animate-bar-grow h-full rounded bg-[var(--studio-amber)]"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
