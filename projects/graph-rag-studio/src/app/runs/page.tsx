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
import { api, API_TOKEN } from "@/lib/client-api";
import type { AuditEntry } from "@/store";

export default function RunsPage() {
  const [rows, setRows] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const res = await api<{ items: AuditEntry[]; total: number }>(
          "/api/runs?pageSize=50",
        );
        setRows(res.items);
        setTotal(res.total);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function downloadCsv() {
    const res = await fetch("/api/runs?format=csv", {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const text = await res.text();
    const blob = new Blob([text], { type: "text/csv" });
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
      subtitle="Pipeline and ask events with CSV export for review."
    >
      <div className="mb-4 flex gap-2">
        <Button variant="outline" disabled={pending} onClick={refresh}>
          Refresh
        </Button>
        <Button onClick={downloadCsv}>Export CSV</Button>
      </div>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
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
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap text-xs">
                {r.at}
              </TableCell>
              <TableCell>{r.actor}</TableCell>
              <TableCell>{r.action}</TableCell>
              <TableCell className="max-w-md truncate text-sm">
                {r.detail}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-sm text-slate-500">{total} events</p>
    </StudioShell>
  );
}
