"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CounterfactualRun, DefensePlan } from "@/store";

export default function CounterfactualsPage() {
  const [plans, setPlans] = useState<DefensePlan[]>([]);
  const [items, setItems] = useState<CounterfactualRun[]>([]);
  const [planId, setPlanId] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: CounterfactualRun[] }>("/api/counterfactuals");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const p = await api<{ items: DefensePlan[] }>("/api/plans");
      setPlans(p.items);
      if (p.items[0]) setPlanId(p.items[0].id);
      const c = await api<{ items: CounterfactualRun[] }>("/api/counterfactuals");
      setItems(c.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<CounterfactualRun>("/api/counterfactuals", {
          method: "POST",
          body: JSON.stringify({ planId, label: label || undefined }),
        });
        setLabel("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Counterfactuals"
      subtitle="Run Counterfactual Physics Injection — projected safety versus act-without-CPI baseline."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run CPI</p>
          <div>
            <Label htmlFor="c-plan">Defense plan</Label>
            <select id="c-plan" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="c-label">Label</Label>
            <Input id="c-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Isolate valve A twin" />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !planId} onClick={create}>
            Inject counterfactual
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="animate-intervene-confirm rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{c.label}</p>
                <Badge>{c.status}</Badge>
                <Badge variant="secondary">Δ {c.delta}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                projected {c.projectedSafety}% · baseline {c.baselineSafety}%
              </p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-slate-500">
                {c.timeline.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
