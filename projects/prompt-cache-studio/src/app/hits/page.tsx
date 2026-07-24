"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  AuditHit,
  CompressionPolicy,
  HitOutcome,
  LlmDeployment,
} from "@/store";

const OUTCOMES: HitOutcome[] = ["hit", "miss", "partial"];

export default function HitsPage() {
  const [deps, setDeps] = useState<LlmDeployment[]>([]);
  const [policies, setPolicies] = useState<CompressionPolicy[]>([]);
  const [items, setItems] = useState<AuditHit[]>([]);
  const [deploymentId, setDeploymentId] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [outcome, setOutcome] = useState<HitOutcome>("hit");
  const [prefixHash, setPrefixHash] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: AuditHit[] }>("/api/hits");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const [d, p, h] = await Promise.all([
        api<{ items: LlmDeployment[] }>("/api/deployments?page=1&pageSize=50"),
        api<{ items: CompressionPolicy[] }>("/api/policies"),
        api<{ items: AuditHit[] }>("/api/hits"),
      ]);
      setDeps(d.items);
      setPolicies(p.items);
      setItems(h.items);
      if (d.items[0]) setDeploymentId(d.items[0].id);
      if (p.items[0]) setPolicyId(p.items[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function record() {
    start(async () => {
      try {
        await api("/api/hits", {
          method: "POST",
          body: JSON.stringify({
            deploymentId,
            policyId,
            outcome,
            prefixHash: prefixHash || undefined,
            detail: detail || undefined,
          }),
        });
        setPrefixHash("");
        setDetail("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Hits"
      subtitle="Audit cache hits, misses, and partial matches when prefixes stay warm or get busted."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Record hit / miss</p>
          <div>
            <Label>Deployment</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={deploymentId} onChange={(e) => setDeploymentId(e.target.value)}>
              {deps.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Policy</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={policyId} onChange={(e) => setPolicyId(e.target.value)}>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Outcome</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={outcome} onChange={(e) => setOutcome(e.target.value as HitOutcome)}>
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <Input value={prefixHash} onChange={(e) => setPrefixHash(e.target.value)} placeholder="Prefix hash (optional)" />
          <Input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Detail" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !deploymentId || !policyId} onClick={record}>
            Record
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((h) => (
            <li key={h.id} className="animate-hit-pulse rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={h.outcome === "hit" ? "default" : "secondary"}>{h.outcome}</Badge>
                <span className="font-mono text-sm text-slate-600">{h.prefixHash}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{h.detail}</p>
              <p className="mt-1 text-xs text-slate-400">{h.at}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
