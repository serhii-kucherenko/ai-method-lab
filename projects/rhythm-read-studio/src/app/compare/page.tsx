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
import type { CompareResult, EcgCohort } from "@/store";
import type { RhythmInput, TrainProfile } from "@/domain/types";

function defaultInput(profile: TrainProfile): RhythmInput {
  return {
    headClassShare: 0.7,
    tailClassShare: 0.12,
    morphologyAnisotropy: 0.65,
    angularCovariance: 0.72,
    adaptiveLogit: 0.68,
    bandProtectQrs: 0.8,
    embeddingUniformity: 0.62,
    labelSparsity: 0.55,
    multiLabelDensity: 0.4,
    profile,
  };
}

export default function ComparePage() {
  const [cohorts, setCohorts] = useState<EcgCohort[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [name, setName] = useState("Tail-heavy nocturnal compare");
  const [profile, setProfile] = useState<TrainProfile>("full");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const c = await api<{ items: EcgCohort[] }>("/api/cohorts?pageSize=50");
      setCohorts(c.items);
      if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
      const cmp = await api<{ items: CompareResult[] }>("/api/compare");
      setRows(cmp.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runCompare() {
    start(async () => {
      try {
        await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name,
            cohortId,
            rhythmInput: defaultInput(profile),
          }),
        });
        setError("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Angular SCL-style vs flat CE / no-tail"
      subtitle="Compare long-tail-aware scoring against a head-dominated baseline."
    >
      <div className="mb-6 space-y-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 lg:max-w-xl">
        <p className="font-medium">Run compare</p>
        <div>
          <Label htmlFor="cmp-name">Name</Label>
          <Input
            id="cmp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Cohort</Label>
          <Select value={cohortId} onValueChange={setCohortId}>
            <SelectTrigger>
              <SelectValue placeholder="Cohort" />
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
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button disabled={pending || !cohortId} onClick={runCompare}>
          Run compare
        </Button>
      </div>

      <ul className="space-y-4">
        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {r.name}
              </p>
              <Badge>
                Winner:{" "}
                {r.winner === "angular_scl"
                  ? "angular SCL"
                  : r.winner === "flat_ce"
                    ? "flat CE"
                    : "tie"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--studio-coral-ink)]">
                  Angular SCL + long-tail
                </p>
                <ScoreBars q={r.angularScl} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Flat CE / no-tail
                </p>
                <ScoreBars q={r.flatCe} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

function ScoreBars({
  q,
}: {
  q: {
    overall: number;
    rareSensitivity: number;
    balancedAccuracy: number;
    tailLift: number;
  };
}) {
  const rows = [
    ["Overall", q.overall],
    ["Rare sensitivity", q.rareSensitivity],
    ["Balanced accuracy", q.balancedAccuracy],
    ["Tail lift", q.tailLift],
  ] as const;
  return (
    <ul className="mt-2 space-y-2">
      {rows.map(([label, value]) => (
        <li key={label}>
          <div className="mb-0.5 flex justify-between text-xs text-slate-600">
            <span>{label}</span>
            <span>{value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-slate-100">
            <div
              className="h-full rounded bg-[var(--studio-coral)]/80"
              style={{ width: `${Math.min(100, value)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
