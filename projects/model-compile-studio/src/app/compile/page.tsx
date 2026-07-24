"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { CompileRun, ModelProject, TargetProfile } from "@/store";
import type { CompileMode, CompileProfile } from "@/domain/types";

export default function CompilePage() {
  const [models, setModels] = useState<ModelProject[]>([]);
  const [targets, setTargets] = useState<TargetProfile[]>([]);
  const [runs, setRuns] = useState<CompileRun[]>([]);
  const [modelId, setModelId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [mode, setMode] = useState<CompileMode>("multi_pass");
  const [profile, setProfile] = useState<CompileProfile>("full");
  const [passBudget, setPassBudget] = useState("8");
  const [fusion, setFusion] = useState("0.74");
  const [affinity, setAffinity] = useState("0.78");
  const [irDepth, setIrDepth] = useState("0.66");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const m = await api<{ items: ModelProject[] }>("/api/models?pageSize=50");
      const t = await api<{ items: TargetProfile[] }>("/api/targets?pageSize=50");
      const r = await api<{ items: CompileRun[] }>("/api/runs?pageSize=20");
      setModels(m.items);
      setTargets(t.items);
      setRuns(r.items);
      if (!modelId && m.items[0]) setModelId(m.items[0].id);
      if (!targetId && t.items[0]) setTargetId(t.items[0].id);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startRun() {
    start(async () => {
      try {
        await api("/api/runs", {
          method: "POST",
          body: JSON.stringify({
            modelId,
            targetId,
            mode,
            profile,
            compileInput: {
              operatorFusionPotential: Number(fusion),
              targetAffinity: Number(affinity),
              irDepth: Number(irDepth),
              passBudget: Number(passBudget),
              profile,
            },
          }),
        });
        setError("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function advance(id: string) {
    start(async () => {
      try {
        await api(`/api/runs/${id}/advance`, { method: "POST" });
        setError("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Multi-pass compile console"
      subtitle="Configure pass budget and plan inputs, then advance stages: queued → lower → optimize → emit → complete."
    >
      <div className="mb-8 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label>Model</Label>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Target</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              {targets.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Mode</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as CompileMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multi_pass">Multi-pass</SelectItem>
              <SelectItem value="single_pass">Single-pass / target-blind</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Profile</Label>
          <Select
            value={profile}
            onValueChange={(v) => setProfile(v as CompileProfile)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pass-budget">Pass budget</Label>
          <Input
            id="pass-budget"
            value={passBudget}
            onChange={(e) => setPassBudget(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fusion">Fusion potential</Label>
          <Input
            id="fusion"
            value={fusion}
            onChange={(e) => setFusion(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="affinity">Target affinity</Label>
          <Input
            id="affinity"
            value={affinity}
            onChange={(e) => setAffinity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ir">IR depth</Label>
          <Input
            id="ir"
            value={irDepth}
            onChange={(e) => setIrDepth(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button disabled={pending || !modelId || !targetId} onClick={startRun}>
            Queue compile run
          </Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-4">
        {runs.map((run) => (
          <div
            key={run.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{run.modelLabel}</p>
              <Badge variant={run.mode === "multi_pass" ? "default" : "secondary"}>
                {run.mode === "multi_pass" ? "Multi-pass" : "Single-pass / target-blind"}
              </Badge>
              <Badge variant="outline">{run.stage}</Badge>
              <Badge variant="outline">{run.profile}</Badge>
            </div>
            {run.passes ? (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {(
                  [
                    ["lower", run.passes.lower],
                    ["fuse", run.passes.fuse],
                    ["layout", run.passes.layout],
                    ["emit", run.passes.emit],
                  ] as const
                ).map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <div className="mt-1 h-2 overflow-hidden rounded bg-slate-100">
                      <div
                        className="h-full bg-[var(--studio-cyan)]"
                        style={{ width: `${Math.min(100, val)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs">{val.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {run.quality ? (
              <p className="mt-3 text-sm text-slate-600">
                Overall {run.quality.overall} · tier {run.quality.predictedArtifactTier} ·
                confidence {run.quality.confidence}
              </p>
            ) : null}
            {run.stage !== "complete" && run.stage !== "failed" ? (
              <Button
                className="mt-3"
                size="sm"
                disabled={pending}
                onClick={() => advance(run.id)}
              >
                Advance stage
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
