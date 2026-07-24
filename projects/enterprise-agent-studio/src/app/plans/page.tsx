"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ErpDomain, PlanRun } from "@/store";
import type { PlanProfile, ScoreMode } from "@/domain/types";

export default function PlansPage() {
  const [domains, setDomains] = useState<ErpDomain[]>([]);
  const [runs, setRuns] = useState<PlanRun[]>([]);
  const [domainId, setDomainId] = useState("");
  const [mode, setMode] = useState<ScoreMode>("multi");
  const [profile, setProfile] = useState<PlanProfile>("balanced");
  const [constraints, setConstraints] = useState("10");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh(id = domainId) {
    start(async () => {
      const d = await api<{ items: ErpDomain[] }>(
        "/api/domains?page=1&pageSize=50",
      );
      setDomains(d.items);
      const useId = id || d.items[0]?.id || "";
      if (!domainId && useId) setDomainId(useId);
      const r = await api<{ items: PlanRun[] }>(
        `/api/runs?domainId=${encodeURIComponent(useId)}&page=1&pageSize=20`,
      );
      setRuns(r.items);
    });
  }

  useEffect(() => {
    refresh("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startPlan() {
    start(async () => {
      try {
        await api<PlanRun>("/api/runs", {
          method: "POST",
          body: JSON.stringify({
            domainId,
            mode,
            profile,
            planInput: { constraintCount: Number(constraints) },
          }),
        });
        setError("");
        refresh(domainId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function advance(id: string) {
    start(async () => {
      try {
        await api<PlanRun>(`/api/runs/${id}/advance`, { method: "POST" });
        refresh(domainId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Resource plans"
      subtitle="Run multi-agent or single-agent plans through intake → allocate → reconcile → review."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Start plan</p>
          <div>
            <Label htmlFor="pd">Domain</Label>
            <select
              id="pd"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={domainId}
              onChange={(e) => {
                setDomainId(e.target.value);
                refresh(e.target.value);
              }}
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="mode">Mode</Label>
            <select
              id="mode"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as ScoreMode)}
            >
              <option value="multi">Multi-agent orchestrated</option>
              <option value="single">Single-agent unchecked</option>
            </select>
          </div>
          <div>
            <Label htmlFor="profile">Profile</Label>
            <select
              id="profile"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={profile}
              onChange={(e) => setProfile(e.target.value as PlanProfile)}
            >
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
          <div>
            <Label htmlFor="cc">Constraint count</Label>
            <Input
              id="cc"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !domainId} onClick={startPlan}>
            Start plan
          </Button>
        </div>

        <ul className="space-y-3">
          {runs.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{r.domainLabel}</p>
                <Badge variant="secondary">{r.mode}</Badge>
                <Badge variant="outline">{r.stage}</Badge>
                <Badge variant="outline">{r.profile}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Constraints {r.input.constraintCount} · Role coverage{" "}
                {r.input.roleCoverage.toFixed(2)}
                {r.quality
                  ? ` · Overall ${r.quality.overall.toFixed(1)}`
                  : ""}
              </p>
              {r.stage !== "complete" && r.stage !== "failed" ? (
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => advance(r.id)}
                >
                  Advance stage
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
