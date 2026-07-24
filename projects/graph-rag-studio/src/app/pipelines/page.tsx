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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/client-api";
import type { CorpusProject, PipelineRun } from "@/store";
import type { ConstructionProfile } from "@/domain/types";

const STAGES = ["queued", "extract", "consolidate", "ready"] as const;

export default function PipelinesPage() {
  const [corpora, setCorpora] = useState<CorpusProject[]>([]);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [corpusId, setCorpusId] = useState("");
  const [profile, setProfile] = useState<ConstructionProfile>("compact");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const c = await api<{ items: CorpusProject[] }>("/api/corpora?pageSize=50");
        setCorpora(c.items);
        if (!corpusId && c.items[0]) setCorpusId(c.items[0].id);
        const p = await api<{ items: PipelineRun[] }>("/api/pipelines?pageSize=50");
        setRuns(p.items);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/pipelines", {
          method: "POST",
          body: JSON.stringify({ corpusId, profile }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "create failed");
      }
    });
  }

  function advance(id: string) {
    start(async () => {
      try {
        await api("/api/pipelines", {
          method: "PATCH",
          body: JSON.stringify({ id, action: "advance" }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "advance failed");
      }
    });
  }

  return (
    <StudioShell
      title="Pipelines"
      subtitle="Multi-step extract → consolidate runs with a stage timeline. Illegal advances on ready/failed are rejected."
    >
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-5">
        <div className="space-y-2">
          <Label>Corpus</Label>
          <Select value={corpusId} onValueChange={setCorpusId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select corpus" />
            </SelectTrigger>
            <SelectContent>
              {corpora.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Profile</Label>
          <Select
            value={profile}
            onValueChange={(v) => setProfile(v as ConstructionProfile)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">compact</SelectItem>
              <SelectItem value="heavy">heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button disabled={pending || !corpusId} onClick={create}>
          Start pipeline
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-6">
        {runs.map((run) => (
          <div
            key={run.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{run.id.slice(0, 8)}…</p>
                <p className="text-sm text-slate-500">
                  profile {run.profile} · v{run.version}
                </p>
              </div>
              <Button
                size="sm"
                disabled={pending || run.stage === "ready" || run.stage === "failed"}
                onClick={() => advance(run.id)}
              >
                Advance stage
              </Button>
            </div>
            <ol className="mt-4 flex flex-wrap gap-2">
              {STAGES.map((s) => {
                const active = run.stage === s;
                const done = STAGES.indexOf(s) < STAGES.indexOf(run.stage as (typeof STAGES)[number]);
                return (
                  <li
                    key={s}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      active
                        ? "animate-stage-pulse border-teal-600 bg-teal-50 text-teal-900"
                        : done
                          ? "border-teal-200 bg-teal-50/50 text-teal-800"
                          : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {s}
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              {run.extractStats ? (
                <Badge variant="secondary">
                  extract: {run.extractStats.mentions} mentions /{" "}
                  {run.extractStats.docs} docs
                </Badge>
              ) : null}
              {run.consolidateStats ? (
                <Badge variant="secondary">
                  consolidate: −{run.consolidateStats.deduped} dups →{" "}
                  {run.consolidateStats.entities} entities /{" "}
                  {run.consolidateStats.edges} edges
                </Badge>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs">{r.id}</TableCell>
              <TableCell>{r.stage}</TableCell>
              <TableCell>{r.profile}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StudioShell>
  );
}
