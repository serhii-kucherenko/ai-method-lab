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
import { api } from "@/lib/client-api";
import type { AuditEntry, CompileRun } from "@/store";

export default function RunsPage() {
  const [runs, setRuns] = useState<CompileRun[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const r = await api<{ items: CompileRun[] }>("/api/runs?pageSize=30");
      const a = await api<{ items: AuditEntry[] }>("/api/audits?pageSize=30");
      setRuns(r.items);
      setAudits(a.items);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function exportCsv() {
    const csv = await api<string>("/api/audits?format=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compile-audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJson() {
    const text = await api<string>("/api/runs?format=json");
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compile-runs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs audit"
      subtitle="Compile history with CSV audit export and JSON run export."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" disabled={pending} onClick={load}>
          Refresh
        </Button>
        <Button onClick={exportCsv}>Export CSV</Button>
        <Button variant="secondary" onClick={exportJson}>
          Export JSON
        </Button>
      </div>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Compile runs
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Overall</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.modelLabel}</TableCell>
              <TableCell>
                <Badge variant="secondary">{r.mode}</Badge>
              </TableCell>
              <TableCell>{r.stage}</TableCell>
              <TableCell>{r.quality?.overall ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="mb-3 mt-10 font-[family-name:var(--font-display)] text-xl">
        Audit log
      </h2>
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
              <TableCell className="text-xs">{a.at.slice(0, 19)}</TableCell>
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
