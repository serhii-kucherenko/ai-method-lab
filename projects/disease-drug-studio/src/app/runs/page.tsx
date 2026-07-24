"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, API_TOKEN } from "@/lib/client-api";
import type { AuditEntry, GenerationRun } from "@/store";

type AuditsPage = { items: AuditEntry[]; total: number };
type RunsPage = { items: GenerationRun[]; total: number };

export default function RunsPage() {
  const [audits, setAudits] = useState<AuditsPage | null>(null);
  const [runs, setRuns] = useState<RunsPage | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      try {
        const [a, r] = await Promise.all([
          api<AuditsPage>("/api/audits?pageSize=30"),
          api<RunsPage>("/api/runs?pageSize=20"),
        ]);
        setAudits(a);
        setRuns(r);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function exportCsv() {
    const res = await fetch("/api/audits?format=csv", {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "runs-audit.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs audit"
      subtitle="Generation stage history and exportable audit trail for discovery review."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={load} disabled={pending}>
          Refresh
        </Button>
        <Button onClick={exportCsv}>Export CSV</Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <h2 className="mb-3 font-medium text-slate-900">Generation runs</h2>
      <ul className="mb-10 space-y-2">
        {(runs?.items ?? []).map((run) => (
          <li
            key={run.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3 text-sm"
          >
            <span className="font-mono text-xs text-slate-500">{run.id.slice(0, 8)}</span>
            <Badge variant="secondary">{run.mode}</Badge>
            <Badge variant="outline">{run.stage}</Badge>
            <span>{run.candidateCount} candidates</span>
            <span className="text-slate-500">{run.updatedAt.slice(0, 19)}</span>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-medium text-slate-900">Audit log</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(audits?.items ?? []).map((a) => (
            <TableRow key={a.id}>
              <TableCell className="whitespace-nowrap text-xs">
                {a.at.slice(0, 19)}
              </TableCell>
              <TableCell>{a.actor}</TableCell>
              <TableCell>{a.action}</TableCell>
              <TableCell className="max-w-md truncate">{a.detail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StudioShell>
  );
}
