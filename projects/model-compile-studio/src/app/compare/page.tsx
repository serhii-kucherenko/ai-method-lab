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
import type { CompareResult, ModelProject } from "@/store";
import type { CompileProfile } from "@/domain/types";

export default function ComparePage() {
  const [models, setModels] = useState<ModelProject[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [modelId, setModelId] = useState("");
  const [name, setName] = useState("Plan quality compare");
  const [profile, setProfile] = useState<CompileProfile>("full");
  const [fusion, setFusion] = useState("0.7");
  const [affinity, setAffinity] = useState("0.75");
  const [budget, setBudget] = useState("8");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const m = await api<{ items: ModelProject[] }>("/api/models?pageSize=50");
      const c = await api<{ items: CompareResult[] }>("/api/compare");
      setModels(m.items);
      setRows(c.items);
      if (!modelId && m.items[0]) setModelId(m.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runCompare() {
    start(async () => {
      try {
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name,
            modelId,
            compileInput: {
              graphComplexity: 0.65,
              operatorFusionPotential: Number(fusion),
              memoryLayoutFit: 0.7,
              quantizationHeadroom: 0.6,
              targetAffinity: Number(affinity),
              irDepth: 0.64,
              kernelCoverage: 0.68,
              passBudget: Number(budget),
              profile,
            },
          }),
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
      title="Multi-pass vs single-pass / target-blind"
      subtitle="Score the same inputs under multi-pass plan quality and a naive single-pass baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2 lg:grid-cols-3">
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
          <Label htmlFor="c-name">Compare name</Label>
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
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
          <Label htmlFor="c-fusion">Fusion potential</Label>
          <Input id="c-fusion" value={fusion} onChange={(e) => setFusion(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="c-aff">Target affinity</Label>
          <Input id="c-aff" value={affinity} onChange={(e) => setAffinity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="c-budget">Pass budget</Label>
          <Input id="c-budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button disabled={pending || !modelId} onClick={runCompare}>
            Run compare
          </Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{row.name}</p>
              <Badge>
                Winner:{" "}
                {row.winner === "multi_pass"
                  ? "Multi-pass"
                  : row.winner === "single_pass"
                    ? "Single-pass"
                    : "Tie"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--studio-cyan-ink)]">
                  Multi-pass {row.multiPass.overall}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-full bg-[var(--studio-cyan)]"
                    style={{ width: `${row.multiPass.overall}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  fusion {row.multiPass.fusionScore} · memory {row.multiPass.memoryScore} ·
                  target {row.multiPass.targetFitScore}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Single-pass / target-blind {row.singlePass.overall}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-full bg-slate-500"
                    style={{ width: `${row.singlePass.overall}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  fusion {row.singlePass.fusionScore} · memory {row.singlePass.memoryScore} ·
                  target {row.singlePass.targetFitScore}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
