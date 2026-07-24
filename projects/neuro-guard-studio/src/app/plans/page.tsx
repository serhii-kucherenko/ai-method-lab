"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DefensePlan, IiotSite, PlanProfile, ScoreMode } from "@/store";

export default function PlansPage() {
  const [sites, setSites] = useState<IiotSite[]>([]);
  const [items, setItems] = useState<DefensePlan[]>([]);
  const [siteId, setSiteId] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScoreMode>("neuro-agentic");
  const [profile, setProfile] = useState<PlanProfile>("balanced");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const params = siteId ? `?siteId=${siteId}` : "";
      const res = await api<{ items: DefensePlan[] }>(`/api/plans${params}`);
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const s = await api<{ items: IiotSite[] }>("/api/sites?page=1&pageSize=50");
      setSites(s.items);
      if (s.items[0]) setSiteId(s.items[0].id);
      const plans = await api<{ items: DefensePlan[] }>("/api/plans");
      setItems(plans.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<DefensePlan>("/api/plans", {
          method: "POST",
          body: JSON.stringify({ siteId, name, mode, profile }),
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
      title="Plans"
      subtitle="Draft LLM defense plans scored as neuro-agentic (CPI) or reactive threshold baselines."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Draft defense plan</p>
          <div>
            <Label htmlFor="p-site">Site</Label>
            <select id="p-site" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Isolate valve A" />
          </div>
          <div>
            <Label htmlFor="p-mode">Mode</Label>
            <select id="p-mode" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={mode} onChange={(e) => setMode(e.target.value as ScoreMode)}>
              <option value="neuro-agentic">neuro-agentic</option>
              <option value="reactive">reactive</option>
            </select>
          </div>
          <div>
            <Label htmlFor="p-profile">Profile</Label>
            <select id="p-profile" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={profile} onChange={(e) => setProfile(e.target.value as PlanProfile)}>
              <option value="balanced">balanced</option>
              <option value="aggressive">aggressive</option>
            </select>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !siteId} onClick={create}>
            Create plan
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((p) => (
            <li key={p.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{p.name}</p>
                <Badge>{p.mode}</Badge>
                <Badge variant="secondary">{p.status}</Badge>
              </div>
              {p.quality ? (
                <p className="mt-2 text-sm text-slate-500">
                  overall {p.quality.overall}% · safety {p.quality.planSafety} · CPI{" "}
                  {p.quality.cpiFit} · cascade {p.quality.cascadeAvoided}
                  {p.readiness?.overallReady ? " · ready" : " · gaps remain"}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
