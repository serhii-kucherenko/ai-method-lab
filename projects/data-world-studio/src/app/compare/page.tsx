"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, DataOperation, WorldInput } from "@/store";

const DEFAULT_INPUT: WorldInput = {
  stateCoverage: 0.82,
  costAwareness: 0.75,
  planHorizon: 0.7,
  simFidelity: 0.68,
  dataQuality: 0.78,
  featureRichness: 0.65,
  agentSkill: 0.72,
  explorationNoise: 0.25,
  retryBudget: 0.4,
  computeBudget: 0.7,
  opComplexity: 0.55,
  stepCount: 14,
  profile: "balanced",
};

export default function ComparePage() {
  const [operations, setOperations] = useState<DataOperation[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [operationId, setOperationId] = useState("");
  const [name, setName] = useState("");
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
      const ops = await api<{ items: DataOperation[] }>(
        "/api/operations?page=1&pageSize=50",
      );
      setOperations(ops.items);
      if (ops.items[0]) setOperationId(ops.items[0].id);
      const cmp = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(cmp.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name,
            operationId,
            worldInput: DEFAULT_INPUT,
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="World-model plan quality versus trial-and-error baseline on the same operation inputs."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run compare</p>
          <div>
            <Label htmlFor="c-op">Operation</Label>
            <select
              id="c-op"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={operationId}
              onChange={(e) => setOperationId(e.target.value)}
            >
              {operations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="World-model lift"
            />
          </div>
          <p className="text-xs text-slate-500">
            Uses a fixed soft-sim input pack (state, cost, horizon, sim
            fidelity) so A and B stay comparable.
          </p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !operationId}
            onClick={create}
          >
            Compare modes
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
                <Badge>winner: {c.winner}</Badge>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[var(--studio-teal)]">
                    World-model {c.worldModel.overall}%
                  </p>
                  <p className="text-xs text-slate-500">
                    accuracy {c.worldModel.outcomeAccuracy} · waste{" "}
                    {c.worldModel.wasteAvoided}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">
                    Trial-and-error {c.trialError.overall}%
                  </p>
                  <p className="text-xs text-slate-500">
                    accuracy {c.trialError.outcomeAccuracy} · waste{" "}
                    {c.trialError.wasteAvoided}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
