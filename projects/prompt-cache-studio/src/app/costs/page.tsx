"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompressionPolicy, CostEstimate, CacheTier, LlmDeployment } from "@/store";

export default function CostsPage() {
  const [deps, setDeps] = useState<LlmDeployment[]>([]);
  const [policies, setPolicies] = useState<CompressionPolicy[]>([]);
  const [tiers, setTiers] = useState<CacheTier[]>([]);
  const [costs, setCosts] = useState<CostEstimate[]>([]);
  const [deploymentId, setDeploymentId] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [label, setLabel] = useState("");
  const [monthlyCalls, setMonthlyCalls] = useState("100000");
  const [tierLabel, setTierLabel] = useState("Provider two-tier");
  const [cached, setCached] = useState("0.3");
  const [uncached, setUncached] = useState("3.0");
  const [ttl, setTtl] = useState("60");
  const [exportText, setExportText] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const [d, p, t, c] = await Promise.all([
        api<{ items: LlmDeployment[] }>("/api/deployments?page=1&pageSize=50"),
        api<{ items: CompressionPolicy[] }>("/api/policies"),
        api<{ items: CacheTier[] }>("/api/tiers"),
        api<{ items: CostEstimate[] }>("/api/costs"),
      ]);
      setDeps(d.items);
      setPolicies(p.items);
      setTiers(t.items);
      setCosts(c.items);
      if (!deploymentId && d.items[0]) setDeploymentId(d.items[0].id);
      if (!policyId && p.items[0]) setPolicyId(p.items[0].id);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createTier() {
    start(async () => {
      try {
        await api("/api/tiers", {
          method: "POST",
          body: JSON.stringify({
            deploymentId,
            label: tierLabel,
            cachedUsdPerMTok: Number(cached),
            uncachedUsdPerMTok: Number(uncached),
            ttlMinutes: Number(ttl),
          }),
        });
        setError("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function createCost() {
    start(async () => {
      try {
        await api("/api/costs", {
          method: "POST",
          body: JSON.stringify({
            policyId,
            label: label || undefined,
            monthlyCalls: Number(monthlyCalls),
          }),
        });
        setLabel("");
        setError("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function doExport() {
    start(async () => {
      const text = await api<string>("/api/costs?export=json");
      setExportText(text);
    });
  }

  return (
    <StudioShell
      title="Costs"
      subtitle="Two-tier estimates: cached prefix tokens stay cheap; uncached suffixes carry full price."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Cache tier</p>
          <div>
            <Label>Deployment</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={deploymentId} onChange={(e) => setDeploymentId(e.target.value)}>
              {deps.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <Input value={tierLabel} onChange={(e) => setTierLabel(e.target.value)} placeholder="Tier label" />
          <div className="grid grid-cols-3 gap-2">
            <Input value={cached} onChange={(e) => setCached(e.target.value)} placeholder="Cached $/MTok" />
            <Input value={uncached} onChange={(e) => setUncached(e.target.value)} placeholder="Uncached $/MTok" />
            <Input value={ttl} onChange={(e) => setTtl(e.target.value)} placeholder="TTL min" />
          </div>
          <Button disabled={pending || !deploymentId} onClick={createTier}>Add tier</Button>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Cost estimate</p>
          <div>
            <Label>Policy</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={policyId} onChange={(e) => setPolicyId(e.target.value)}>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Estimate label" />
          <Input value={monthlyCalls} onChange={(e) => setMonthlyCalls(e.target.value)} placeholder="Monthly calls" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button disabled={pending || !policyId} onClick={createCost}>Estimate</Button>
            <Button variant="outline" onClick={doExport}>Export JSON</Button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 font-medium text-slate-900">Tiers</p>
          <ul className="space-y-2">
            {tiers.map((t) => (
              <li key={t.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3 text-sm">
                <span className="font-medium">{t.label}</span>
                <span className="text-slate-500"> · cached ${t.cachedUsdPerMTok}/M · uncached ${t.uncachedUsdPerMTok}/M · TTL {t.ttlMinutes}m</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-medium text-slate-900">Estimates</p>
          <ul className="space-y-2">
            {costs.map((c) => (
              <li key={c.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{c.label}</p>
                  <Badge variant="secondary">${c.totalSpend}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {c.monthlyCalls.toLocaleString()} calls · cached ${c.cachedSpend} · uncached ${c.uncachedSpend} · vs naive ${c.savingsVsNaive}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {exportText ? (
        <pre className="mt-6 max-h-48 overflow-auto rounded-lg border border-[var(--studio-line)] bg-slate-950 p-3 text-xs text-emerald-200">{exportText}</pre>
      ) : null}
    </StudioShell>
  );
}
