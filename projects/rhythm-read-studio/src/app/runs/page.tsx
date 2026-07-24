"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/client-api";
import type { AuditEntry, TrainEvalRun } from "@/store";

export default function RunsPage() {
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [runs, setRuns] = useState<TrainEvalRun[]>([]);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const a = await api<{ items: AuditEntry[] }>("/api/audits?pageSize=30");
      setAudits(a.items);
      const r = await api<{ items: TrainEvalRun[] }>("/api/runs?pageSize=30");
      setRuns(r.items);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function exportCsv() {
    const csv = await api<string>("/api/audits?format=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rhythm-audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJson() {
    const text = await api<string>("/api/runs?format=json");
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rhythm-runs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs audit"
      subtitle="Review train/eval history and export CSV / JSON for review."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" disabled={pending} onClick={exportCsv}>
          Export CSV
        </Button>
        <Button variant="outline" disabled={pending} onClick={exportJson}>
          Export JSON runs
        </Button>
        <Button variant="ghost" disabled={pending} onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="mb-8 overflow-x-auto rounded-lg border border-[var(--studio-line)] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cohort</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Overall</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.cohortLabel}</TableCell>
                <TableCell>{r.mode}</TableCell>
                <TableCell>{r.stage}</TableCell>
                <TableCell>{r.quality?.overall ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Audit log
      </h2>
      <div className="overflow-x-auto rounded-lg border border-[var(--studio-line)] bg-white">
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
            {audits.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="whitespace-nowrap text-xs">
                  {a.at}
                </TableCell>
                <TableCell>{a.actor}</TableCell>
                <TableCell>{a.action}</TableCell>
                <TableCell className="max-w-md truncate text-sm">
                  {a.detail}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </StudioShell>
  );
}
