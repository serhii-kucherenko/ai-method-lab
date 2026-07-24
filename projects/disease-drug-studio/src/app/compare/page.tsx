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
import type { CompareResult, DiseaseProgram } from "@/store";
import type { GenerationInput, TrainingProfile } from "@/domain/types";

type ProgramsPage = { items: DiseaseProgram[] };
type ComparePage = { items: CompareResult[] };

export default function ComparePage() {
  const [programs, setPrograms] = useState<DiseaseProgram[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [programId, setProgramId] = useState("");
  const [name, setName] = useState("DN ACE aware vs blind");
  const [profile, setProfile] = useState<TrainingProfile>("grpo");
  const [cond, setCond] = useState("0.85");
  const [affinity, setAffinity] = useState("8.5");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const [p, c] = await Promise.all([
          api<ProgramsPage>("/api/programs?pageSize=50"),
          api<ComparePage>("/api/compare"),
        ]);
        setPrograms(p.items);
        setRows(c.items);
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

  function runCompare() {
    start(async () => {
      try {
        const generationInput: GenerationInput = {
          meshDepth: 3,
          targetLength: 420,
          conditioningStrength: Number(cond),
          seedDiversity: 0.72,
          batchSize: 120,
          noveltyPrior: 0.62,
          affinityPrior: Number(affinity),
          approvedSimilarityPrior: 0.58,
          profile,
        };
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({ name, programId, generationInput }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "compare_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Disease-aware vs disease-blind"
      subtitle="Side-by-side dual scores — disease context should lift disease fit and affinity."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Compare name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Program</Label>
          <Select value={programId} onValueChange={setProgramId}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
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
          <Label>Profile</Label>
          <Select
            value={profile}
            onValueChange={(v) => setProfile(v as TrainingProfile)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sft">SFT</SelectItem>
              <SelectItem value="grpo">GRPO</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Conditioning strength</Label>
          <Input value={cond} onChange={(e) => setCond(e.target.value)} />
        </div>
        <div>
          <Label>Affinity prior</Label>
          <Input value={affinity} onChange={(e) => setAffinity(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button onClick={runCompare} disabled={pending || !programId}>
            Run compare
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-6">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl">
                {row.name}
              </h3>
              <Badge>
                Winner:{" "}
                {row.winner === "disease_aware"
                  ? "disease-aware"
                  : row.winner === "disease_blind"
                    ? "disease-blind"
                    : "tie"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ScoreBlock
                title="Disease-aware"
                overall={row.diseaseAware.overall}
                diseaseFit={row.diseaseAware.diseaseFitScore}
                affinity={row.diseaseAware.affinityScore}
                delay="0ms"
              />
              <ScoreBlock
                title="Disease-blind"
                overall={row.diseaseBlind.overall}
                diseaseFit={row.diseaseBlind.diseaseFitScore}
                affinity={row.diseaseBlind.affinityScore}
                delay="80ms"
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
  diseaseFit,
  affinity,
  delay,
}: {
  title: string;
  overall: number;
  diseaseFit: number;
  affinity: number;
  delay: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="mt-1 text-2xl text-[var(--studio-teal-ink)]">{overall}</p>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <Bar label="Disease fit" value={diseaseFit} delay={delay} />
        <Bar label="Affinity" value={affinity} delay={delay} />
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-slate-100">
        <div
          className="animate-bar-draw h-full rounded bg-[var(--studio-teal)]"
          style={{ width: `${Math.min(100, value)}%`, animationDelay: delay }}
        />
      </div>
    </div>
  );
}
