"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, LlmDeployment } from "@/store";

export default function ComparePage() {
  const [deps, setDeps] = useState<LlmDeployment[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [deploymentId, setDeploymentId] = useState("");
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
      const [d, c] = await Promise.all([
        api<{ items: LlmDeployment[] }>("/api/deployments?page=1&pageSize=50"),
        api<{ items: CompareResult[] }>("/api/compare"),
      ]);
      setDeps(d.items);
      setItems(c.items);
      if (d.items[0]) setDeploymentId(d.items[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    start(async () => {
      try {
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name: name || "Cache-aware vs naive",
            deploymentId,
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
      subtitle="Cache-aware plans keep prefix cache + two-tier savings; naive query-aware compression busts the cache."
    >
      <div className="mb-6 space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <Label>Deployment</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={deploymentId} onChange={(e) => setDeploymentId(e.target.value)}>
              {deps.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Label</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Assist traffic A/B" />
          </div>
          <div className="flex items-end">
            <Button disabled={pending || !deploymentId} onClick={run}>
              Run compare
            </Button>
          </div>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <ul className="space-y-4">
        {items.map((c) => (
          <li key={c.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg text-slate-900">{c.name}</p>
              <Badge>winner: {c.winner}</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-mint)]">Cache-aware</p>
                <div className="mt-2 space-y-2">
                  {[
                    ["Hit rate", c.cacheAware.cacheHitRate],
                    ["Prefix", c.cacheAware.prefixPreserved],
                    ["Tier savings", c.cacheAware.tierSavings],
                    ["Overall", c.cacheAware.overall],
                  ].map(([label, pct], i) => (
                    <div key={String(label)}>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{label}</span>
                        <span>{pct}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded bg-slate-100">
                        <div
                          className="animate-bar-grow h-full rounded bg-[var(--studio-mint)]"
                          style={{ width: `${Math.min(100, Number(pct))}%`, animationDelay: `${i * 80}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Naive-bust</p>
                <div className="mt-2 space-y-2">
                  {[
                    ["Hit rate", c.naiveBust.cacheHitRate],
                    ["Prefix", c.naiveBust.prefixPreserved],
                    ["Tier savings", c.naiveBust.tierSavings],
                    ["Overall", c.naiveBust.overall],
                  ].map(([label, pct], i) => (
                    <div key={String(label)}>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{label}</span>
                        <span>{pct}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded bg-slate-100">
                        <div
                          className="animate-bar-grow h-full rounded bg-slate-400"
                          style={{ width: `${Math.min(100, Number(pct))}%`, animationDelay: `${i * 80}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
