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
import type { DeployApp, DeployRun } from "@/store";

export default function DeployPage() {
  const [apps, setApps] = useState<DeployApp[]>([]);
  const [runs, setRuns] = useState<DeployRun[]>([]);
  const [appId, setAppId] = useState("");
  const [mode, setMode] = useState<"harnessed" | "naive">("harnessed");
  const [profile, setProfile] = useState<"full" | "fast">("full");
  const [irDepth, setIrDepth] = useState("0.78");
  const [gate, setGate] = useState("0.74");
  const [passes, setPasses] = useState("5");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const a = await api<{ items: DeployApp[] }>("/api/apps?page=1&pageSize=50");
      setApps(a.items);
      if (!appId && a.items[0]) setAppId(a.items[0].id);
      const r = await api<{ items: DeployRun[] }>("/api/runs?page=1&pageSize=20");
      setRuns(r.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<DeployRun>("/api/runs", {
          method: "POST",
          body: JSON.stringify({
            appId,
            mode,
            profile,
            deployInput: {
              irValidationDepth: Number(irDepth),
              measurementGateStrictness: Number(gate),
              candidatePassCount: Number(passes),
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
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Harnessed deploy console"
      subtitle="Run agent-harnessed multi-check plans or naive single-shot baselines."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-100">Start deploy plan</p>
          <div>
            <Label>App</Label>
            <Select value={appId} onValueChange={setAppId}>
              <SelectTrigger>
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
            <Label>Mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as "harnessed" | "naive")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harnessed">Harnessed multi-check</SelectItem>
                <SelectItem value="naive">Naive single-shot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Profile</Label>
            <Select
              value={profile}
              onValueChange={(v) => setProfile(v as "full" | "fast")}
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
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="ir">IR depth</Label>
              <Input
                id="ir"
                value={irDepth}
                onChange={(e) => setIrDepth(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gate">Measure gate</Label>
              <Input
                id="gate"
                value={gate}
                onChange={(e) => setGate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pass">Passes</Label>
              <Input
                id="pass"
                value={passes}
                onChange={(e) => setPasses(e.target.value)}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button disabled={pending || !appId} onClick={create}>
            Queue plan
          </Button>
        </div>

        <div className="space-y-3">
          {runs.map((run) => (
            <div
              key={run.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-100">{run.appLabel}</p>
                <Badge variant="secondary">{run.mode}</Badge>
                <Badge>{run.stage}</Badge>
                <Badge variant="outline">{run.profile}</Badge>
              </div>
              {run.quality ? (
                <p className="mt-2 text-sm text-slate-400">
                  overall {run.quality.overall} · TTFO {run.quality.ttfoScore} ·
                  lift {run.quality.harnessLift}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Stages: queued → ir → validate → transform → measure → complete
                </p>
              )}
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
      </div>
    </StudioShell>
  );
}
