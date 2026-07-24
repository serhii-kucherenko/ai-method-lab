"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { DeployApp, CompareResult } from "@/store";

export default function ComparePage() {
  const [apps, setApps] = useState<DeployApp[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [appId, setAppId] = useState("");
  const [name, setName] = useState("Harnessed vs naive");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const a = await api<{ items: DeployApp[] }>("/api/apps?page=1&pageSize=50");
      setApps(a.items);
      if (!appId && a.items[0]) setAppId(a.items[0].id);
      const c = await api<{ items: CompareResult[] }>("/api/compare");
      setRows(c.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    start(async () => {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          appId,
          deployInput: {
            pipelineStages: 7,
            gpuBudget: 4,
            modalityCount: 3,
            latencyWeight: 0.75,
            throughputWeight: 0.5,
            streamingOverlap: 0.7,
            stateScopeComplexity: 0.65,
            placementFlexibility: 0.72,
            irValidationDepth: 0.8,
            measurementGateStrictness: 0.76,
            candidatePassCount: 6,
            profile: "full",
          },
        }),
      });
      refresh();
    });
  }

  return (
    <StudioShell
      title="Harnessed vs naive single-shot"
      subtitle="Quantify harness lift against a baseline with no IR / measure loop."
    >
      <div className="mb-6 flex flex-wrap gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label>App</Label>
          <Select value={appId} onValueChange={setAppId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select app" />
            </SelectTrigger>
            <SelectContent>
              {apps.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cn">Compare name</Label>
          <Input
            id="cn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button disabled={pending || !appId} onClick={run}>
            Run compare
          </Button>
        </div>
      </div>

      <ul className="space-y-4">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-100">{row.name}</p>
              <Badge>Winner: {row.winner}</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ScoreBlock
                title="Harnessed"
                overall={row.harnessed.overall}
                ttfo={row.harnessed.ttfoScore}
                lift={row.harnessed.harnessLift}
              />
              <ScoreBlock
                title="Naive single-shot"
                overall={row.naive.overall}
                ttfo={row.naive.ttfoScore}
                lift={row.naive.harnessLift}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

function ScoreBlock({
  title,
  overall,
  ttfo,
  lift,
}: {
  title: string;
  overall: number;
  ttfo: number;
  lift: number;
}) {
  return (
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <div className="mt-2 space-y-2">
        {[
          { label: "Overall", v: overall },
          { label: "TTFO", v: ttfo },
          { label: "Lift", v: lift },
        ].map((m) => (
          <div key={m.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{m.label}</span>
              <span>{m.v}</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-slate-800">
              <div
                className="animate-bar-rise h-full bg-[var(--studio-amber)]"
                style={{ width: `${Math.min(100, m.v)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
