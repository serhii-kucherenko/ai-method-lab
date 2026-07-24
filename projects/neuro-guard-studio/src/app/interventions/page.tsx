"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DefensePlan, Intervention, InterventionStatus } from "@/store";

const STATUSES: InterventionStatus[] = [
  "proposed",
  "approved",
  "applied",
  "rolled-back",
];

export default function InterventionsPage() {
  const [plans, setPlans] = useState<DefensePlan[]>([]);
  const [items, setItems] = useState<Intervention[]>([]);
  const [planId, setPlanId] = useState("");
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: Intervention[] }>("/api/interventions");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const p = await api<{ items: DefensePlan[] }>("/api/plans");
      setPlans(p.items);
      if (p.items[0]) setPlanId(p.items[0].id);
      const i = await api<{ items: Intervention[] }>("/api/interventions");
      setItems(i.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<Intervention>("/api/interventions", {
          method: "POST",
          body: JSON.stringify({ planId, action, notes }),
        });
        setAction("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function setStatus(id: string, status: InterventionStatus) {
    start(async () => {
      try {
        await api<Intervention>("/api/interventions", {
          method: "PATCH",
          body: JSON.stringify({ id, status }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Interventions"
      subtitle="Propose and advance interventions only after CPI clears cascade risk."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Propose intervention</p>
          <div>
            <Label htmlFor="i-plan">Plan</Label>
            <select id="i-plan" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="i-action">Action</Label>
            <Input id="i-action" value={action} onChange={(e) => setAction(e.target.value)} placeholder="Isolate valve A" />
          </div>
          <div>
            <Label htmlFor="i-notes">Notes</Label>
            <Input id="i-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !action.trim() || !planId} onClick={create}>
            Propose
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{i.action}</p>
                <Badge>{i.status}</Badge>
                <Badge variant="secondary">risk {i.riskScore}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{i.notes || "No notes"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((st) => (
                  <Button
                    key={st}
                    size="sm"
                    variant={i.status === st ? "default" : "outline"}
                    disabled={pending || i.status === st}
                    onClick={() => setStatus(i.id, st)}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
