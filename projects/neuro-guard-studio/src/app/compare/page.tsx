"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, GuardInput, IiotSite } from "@/store";

const DEFAULT_INPUT: GuardInput = {
  sensorCoverage: 0.84,
  physicsFidelity: 0.76,
  planHorizon: 0.72,
  threatSeverity: 0.55,
  anomalyConfidence: 0.74,
  latencyBudget: 0.68,
  actuatorRisk: 0.3,
  contextFreshness: 0.8,
  thresholdNoise: 0.24,
  isolationDepth: 0.7,
  cascadeRisk: 0.4,
  sensorCount: 12,
  profile: "balanced",
};

export default function ComparePage() {
  const [sites, setSites] = useState<IiotSite[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [siteId, setSiteId] = useState("");
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
      const s = await api<{ items: IiotSite[] }>("/api/sites?page=1&pageSize=50");
      setSites(s.items);
      if (s.items[0]) setSiteId(s.items[0].id);
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
            siteId,
            guardInput: DEFAULT_INPUT,
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
      subtitle="Neuro-agentic plan quality versus reactive threshold baseline on the same site inputs."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run compare</p>
          <div>
            <Label htmlFor="c-site">Site</Label>
            <select id="c-site" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="CPI lift vs reactive" />
          </div>
          <p className="text-xs text-slate-500">
            Uses a fixed soft-sim input pack (coverage, physics, horizon, cascade) so A and B stay comparable.
          </p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !siteId} onClick={create}>
            Compare modes
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{c.name}</p>
                <Badge>winner: {c.winner}</Badge>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[var(--studio-steel)]">
                    Neuro-agentic {c.neuroAgentic.overall}%
                  </p>
                  <p className="text-xs text-slate-500">
                    safety {c.neuroAgentic.planSafety} · cascade {c.neuroAgentic.cascadeAvoided}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--studio-amber)]">
                    Reactive {c.reactive.overall}%
                  </p>
                  <p className="text-xs text-slate-500">
                    safety {c.reactive.planSafety} · cascade {c.reactive.cascadeAvoided}
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
