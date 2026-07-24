"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  CompressionPolicy,
  CompressProfile,
  LlmDeployment,
  ScoreMode,
} from "@/store";

export default function PoliciesPage() {
  const [deps, setDeps] = useState<LlmDeployment[]>([]);
  const [items, setItems] = useState<CompressionPolicy[]>([]);
  const [deploymentId, setDeploymentId] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScoreMode>("cache-aware");
  const [profile, setProfile] = useState<CompressProfile>("balanced");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(dep = deploymentId) {
    start(async () => {
      const qs = dep ? `?deploymentId=${encodeURIComponent(dep)}` : "";
      const res = await api<{ items: CompressionPolicy[] }>(`/api/policies${qs}`);
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const res = await api<{ items: LlmDeployment[] }>(
        "/api/deployments?page=1&pageSize=50",
      );
      setDeps(res.items);
      if (res.items[0]) setDeploymentId(res.items[0].id);
      const policies = await api<{ items: CompressionPolicy[] }>("/api/policies");
      setItems(policies.items);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<CompressionPolicy>("/api/policies", {
          method: "POST",
          body: JSON.stringify({ deploymentId, name, mode, profile }),
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
      title="Policies"
      subtitle="Cache-aware policies preserve the shared prefix; naive-bust policies rewrite it and lose tier savings."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Create policy</p>
          <div>
            <Label htmlFor="pol-dep">Deployment</Label>
            <select id="pol-dep" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={deploymentId} onChange={(e) => setDeploymentId(e.target.value)}>
              {deps.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="pol-name">Name</Label>
            <Input id="pol-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Suffix-only compress" />
          </div>
          <div>
            <Label htmlFor="pol-mode">Mode</Label>
            <select id="pol-mode" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={mode} onChange={(e) => setMode(e.target.value as ScoreMode)}>
              <option value="cache-aware">cache-aware</option>
              <option value="naive-bust">naive-bust</option>
            </select>
          </div>
          <div>
            <Label htmlFor="pol-prof">Profile</Label>
            <select id="pol-prof" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={profile} onChange={(e) => setProfile(e.target.value as CompressProfile)}>
              <option value="balanced">balanced</option>
              <option value="aggressive">aggressive</option>
            </select>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !deploymentId} onClick={create}>
            Activate policy
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((p) => (
            <li key={p.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{p.name}</p>
                <Badge variant={p.mode === "cache-aware" ? "default" : "secondary"}>{p.mode}</Badge>
                <Badge variant="outline">{p.status}</Badge>
              </div>
              {p.quality ? (
                <p className="mt-2 text-sm text-slate-500">
                  hit {p.quality.cacheHitRate} · prefix {p.quality.prefixPreserved} · tier {p.quality.tierSavings} · overall {p.quality.overall}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
