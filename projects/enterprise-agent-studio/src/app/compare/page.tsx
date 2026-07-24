"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, ErpDomain } from "@/store";
import type { PlanInput } from "@/domain/types";

function defaultInput(): PlanInput {
  return {
    domainComplexity: 0.7,
    constraintCount: 12,
    roleCoverage: 0.8,
    coordinationRounds: 4,
    conflictResolutionDepth: 0.72,
    capacityTightness: 0.6,
    demandVolatility: 0.45,
    crossDomainLinks: 2,
    auditTrailStrictness: 0.68,
    plannerSpecialization: 0.75,
    allocatorSpecialization: 0.7,
    reviewerSpecialization: 0.65,
    profile: "balanced",
  };
}

export default function ComparePage() {
  const [domains, setDomains] = useState<ErpDomain[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [domainId, setDomainId] = useState("");
  const [name, setName] = useState("Multi vs single");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function load() {
    start(async () => {
      const d = await api<{ items: ErpDomain[] }>(
        "/api/domains?page=1&pageSize=50",
      );
      setDomains(d.items);
      if (!domainId && d.items[0]) setDomainId(d.items[0].id);
      const c = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(c.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runCompare() {
    start(async () => {
      try {
        const domain = domains.find((d) => d.id === domainId);
        const input = defaultInput();
        if (domain) {
          input.domainComplexity = domain.complexity;
          input.crossDomainLinks = domain.crossLinks;
        }
        await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({ name, domainId, planInput: input }),
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
      title="Compare"
      subtitle="Multi-agent role orchestration versus a single unchecked agent baseline."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label htmlFor="cn">Compare name</Label>
          <Input
            id="cn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cd">Domain</Label>
          <select
            id="cd"
            className="flex h-8 min-w-48 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={domainId}
            onChange={(e) => setDomainId(e.target.value)}
          >
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <Button disabled={pending || !domainId} onClick={runCompare}>
          Run compare
        </Button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-900">{c.name}</p>
              <Badge>
                Winner:{" "}
                {c.winner === "multi"
                  ? "multi-agent"
                  : c.winner === "single"
                    ? "single-agent"
                    : "tie"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                { label: "Multi-agent", q: c.multi, color: "bg-[var(--studio-emerald)]" },
                { label: "Single-agent", q: c.single, color: "bg-slate-400" },
              ].map((col) => (
                <div key={col.label}>
                  <p className="text-sm font-medium text-slate-700">
                    {col.label} · {col.q.overall.toFixed(1)}
                  </p>
                  <div className="mt-2 h-3 overflow-hidden rounded bg-slate-100">
                    <div
                      className={`animate-bar-rise h-full ${col.color}`}
                      style={{ width: `${Math.min(100, col.q.overall)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Fit {col.q.allocationFit.toFixed(0)} · Constraints{" "}
                    {col.q.constraintSatisfaction.toFixed(0)} · Lift{" "}
                    {col.q.coordinationLift.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No compares yet.</p>
        ) : null}
      </ul>
    </StudioShell>
  );
}
