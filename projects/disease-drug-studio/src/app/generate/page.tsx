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
import type { DiseaseProgram, GenerationRun } from "@/store";
import type { GenerationMode, TrainingProfile } from "@/domain/types";

type ProgramsPage = { items: DiseaseProgram[] };
type RunsPage = { items: GenerationRun[] };

export default function GeneratePage() {
  const [programs, setPrograms] = useState<DiseaseProgram[]>([]);
  const [runs, setRuns] = useState<GenerationRun[]>([]);
  const [programId, setProgramId] = useState("");
  const [mode, setMode] = useState<GenerationMode>("disease_aware");
  const [profile, setProfile] = useState<TrainingProfile>("grpo");
  const [conditioning, setConditioning] = useState("0.8");
  const [batchSize, setBatchSize] = useState("100");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const [p, r] = await Promise.all([
          api<ProgramsPage>("/api/programs?pageSize=50"),
          api<RunsPage>("/api/runs?pageSize=20"),
        ]);
        setPrograms(p.items);
        setRuns(r.items);
        if (!programId && p.items[0]) setProgramId(p.items[0].id);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createRun() {
    start(async () => {
      try {
        await api("/api/runs", {
          method: "POST",
          body: JSON.stringify({
            programId,
            mode,
            profile,
            generationInput: {
              conditioningStrength: Number(conditioning),
              batchSize: Number(batchSize),
              profile,
            },
          }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "create_failed");
      }
    });
  }

  function advance(runId: string) {
    start(async () => {
      try {
        await api("/api/runs", {
          method: "POST",
          body: JSON.stringify({ action: "advance", runId }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "advance_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Generation console"
      subtitle="Disease-aware conditioning console — advance queued → conditioning → generating → ranked."
    >
      <div className="mb-8 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Disease program</Label>
          <Select value={programId} onValueChange={setProgramId}>
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Mode</Label>
          <Select
            value={mode}
            onValueChange={(v) => setMode(v as GenerationMode)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disease_aware">Disease-aware</SelectItem>
              <SelectItem value="disease_blind">Disease-blind baseline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Training profile</Label>
          <Select
            value={profile}
            onValueChange={(v) => setProfile(v as TrainingProfile)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sft">SFT</SelectItem>
              <SelectItem value="grpo">GRPO-reinforced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cond">Conditioning strength (0–1)</Label>
          <Input
            id="cond"
            value={conditioning}
            onChange={(e) => setConditioning(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="batch">Batch size</Label>
          <Input
            id="batch"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={createRun} disabled={pending || !programId}>
            Queue generation
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {runs.map((run) => (
          <li
            key={run.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>{run.mode}</Badge>
                <Badge variant="secondary">{run.profile}</Badge>
                <Badge
                  variant="outline"
                  className={
                    run.stage === "ranked" ? "animate-stage-pulse border-teal-600" : ""
                  }
                >
                  {run.stage}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Cond {run.input.conditioningStrength} · batch {run.input.batchSize}
                {run.quality
                  ? ` · overall ${run.quality.overall} · unique ${run.quality.uniqueCandidates}`
                  : ""}
              </p>
            </div>
            {run.stage !== "ranked" && run.stage !== "failed" ? (
              <Button
                variant="outline"
                onClick={() => advance(run.id)}
                disabled={pending}
              >
                Advance stage
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
