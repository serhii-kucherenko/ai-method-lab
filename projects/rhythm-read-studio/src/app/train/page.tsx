"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { EcgCohort, TrainEvalRun } from "@/store";
import type { ScoreMode, TrainProfile } from "@/domain/types";

export default function TrainPage() {
  const [cohorts, setCohorts] = useState<EcgCohort[]>([]);
  const [runs, setRuns] = useState<TrainEvalRun[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [mode, setMode] = useState<ScoreMode>("angular_scl");
  const [profile, setProfile] = useState<TrainProfile>("full");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const c = await api<{ items: EcgCohort[] }>("/api/cohorts?pageSize=50");
      setCohorts(c.items);
      if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
      const r = await api<{ items: TrainEvalRun[] }>("/api/runs?pageSize=20");
      setRuns(r.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createRun() {
    start(async () => {
      try {
        await api<TrainEvalRun>("/api/runs", {
          method: "POST",
          body: JSON.stringify({ cohortId, mode, profile }),
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
        await api<TrainEvalRun>(`/api/runs/${id}/advance`, { method: "POST" });
        setError("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Long-tail-aware train/eval console"
      subtitle="Advance stages from queued through augment, contrastive, and calibrate."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium">Start profile</p>
          <div>
            <Label>Cohort</Label>
            <Select value={cohortId} onValueChange={setCohortId}>
              <SelectTrigger>
                <SelectValue placeholder="Select cohort" />
              </SelectTrigger>
              <SelectContent>
                {cohorts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as ScoreMode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="angular_scl">
                  Angular SCL + long-tail
                </SelectItem>
                <SelectItem value="flat_ce">Flat CE / no-tail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Profile</Label>
            <Select
              value={profile}
              onValueChange={(v) => setProfile(v as TrainProfile)}
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
          <p className="text-xs text-slate-500">
            Flat CE / no-tail baseline mode ignores angular covariance and
            adaptive logits. Soft simulation disclaimer — no clinical device
            claims.
          </p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !cohortId} onClick={createRun}>
            Queue train/eval
          </Button>
        </div>

        <ul className="space-y-3">
          {runs.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{r.cohortLabel}</p>
                <Badge>{r.stage}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {r.mode === "angular_scl"
                  ? "Angular SCL + long-tail"
                  : "Flat CE / no-tail"}{" "}
                · {r.profile}
              </p>
              {r.quality ? (
                <p className="mt-2 text-sm">
                  Overall {r.quality.overall} · rare sens{" "}
                  {r.quality.rareSensitivity} · tail lift {r.quality.tailLift}
                </p>
              ) : null}
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
