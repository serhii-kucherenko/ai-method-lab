"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
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
import type { EmbedMode, EmbedProfile } from "@/domain/types";
import type { EvalRun, SlideCohort } from "@/store";

export default function EmbedPage() {
  const [cohorts, setCohorts] = useState<SlideCohort[]>([]);
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [mode, setMode] = useState<EmbedMode>("multi_signal");
  const [profile, setProfile] = useState<EmbedProfile>("full");
  const [slideLabel, setSlideLabel] = useState("Query slide");
  const [activeRun, setActiveRun] = useState<EvalRun | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  useEffect(() => {
    start(async () => {
      const c = await api<{ items: SlideCohort[] }>("/api/cohorts?pageSize=50");
      setCohorts(c.items);
      if (c.items[0]) setCohortId(c.items[0].id);
      const r = await api<{ items: EvalRun[] }>("/api/runs?pageSize=20");
      setRuns(r.items);
    });
  }, []);

  function createRun() {
    start(async () => {
      try {
        const run = await api<EvalRun>("/api/runs", {
          method: "POST",
          body: JSON.stringify({ cohortId, mode, profile, slideLabel }),
        });
        setActiveRun(run);
        const r = await api<{ items: EvalRun[] }>("/api/runs?pageSize=20");
        setRuns(r.items);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function advance() {
    if (!activeRun) return;
    start(async () => {
      try {
        const run = await api<EvalRun>(`/api/runs/${activeRun.id}/advance`, {
          method: "POST",
        });
        setActiveRun(run);
        const r = await api<{ items: EvalRun[] }>("/api/runs?pageSize=20");
        setRuns(r.items);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Multi-signal embed console"
      subtitle="Run vision + vision-language + slide-level profiles, or a vision-only baseline."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <div>
            <Label>Cohort</Label>
            <Select value={cohortId} onValueChange={setCohortId}>
              <SelectTrigger className="mt-1">
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
              onValueChange={(v) => setMode(v as EmbedMode)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multi_signal">Multi-signal</SelectItem>
                <SelectItem value="vision_only">Vision-only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Profile</Label>
            <Select
              value={profile}
              onValueChange={(v) => setProfile(v as EmbedProfile)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="slide-label">Slide label</Label>
            <Input
              id="slide-label"
              className="mt-1"
              value={slideLabel}
              onChange={(e) => setSlideLabel(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={createRun} disabled={pending || !cohortId}>
              Queue embed run
            </Button>
            <Button
              variant="outline"
              onClick={advance}
              disabled={pending || !activeRun || activeRun.stage === "complete"}
            >
              Advance stage
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium text-stone-900">Active run</p>
          {activeRun ? (
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <p>
                {activeRun.slideLabel} · {activeRun.mode} · {activeRun.profile}
              </p>
              <p>
                Stage: <strong>{activeRun.stage}</strong>
              </p>
              {activeRun.quality ? (
                <div className="mt-4 space-y-2">
                  <p>Overall {activeRun.quality.overall}</p>
                  <p>Vision {activeRun.quality.visionScore}</p>
                  <p>Language {activeRun.quality.languageScore}</p>
                  <p>Slide {activeRun.quality.slideScore}</p>
                  <p>Task fit: {activeRun.quality.predictedTaskFit}</p>
                </div>
              ) : (
                <p className="text-stone-500">
                  Advance through tiling → embedding → complete.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone-500">
              Queue a run to begin the embed workflow.
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
          Recent runs
        </h2>
        <ul className="mt-4 space-y-2">
          {runs.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            >
              <span>
                {r.slideLabel} · {r.mode} · {r.stage}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveRun(r)}
              >
                Select
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
