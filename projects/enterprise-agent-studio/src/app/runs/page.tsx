"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";
import type { AuditEntry, PlanRun } from "@/store";

export default function RunsPage() {
  const [runs, setRuns] = useState<PlanRun[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const r = await api<{ items: PlanRun[] }>(
        "/api/runs?page=1&pageSize=30",
      );
      setRuns(r.items);
      const a = await api<{ items: AuditEntry[] }>(
        "/api/audits?page=1&pageSize=30",
      );
      setAudits(a.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportCsv() {
    start(async () => {
      const csv = await api<string>("/api/audits?format=csv");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enterprise-agent-audits.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function exportJson() {
    start(async () => {
      const text = await api<string>("/api/runs?format=json");
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enterprise-agent-runs.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <StudioShell
      title="Runs & audit"
      subtitle="Inspect plan runs and export CSV audits or JSON run payloads."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" disabled={pending} onClick={exportCsv}>
          Export audits CSV
        </Button>
        <Button variant="outline" disabled={pending} onClick={exportJson}>
          Export runs JSON
        </Button>
        <Button variant="ghost" disabled={pending} onClick={load}>
          Refresh
        </Button>
      </div>

      <h2 className="mb-3 font-medium text-slate-900">Plan runs</h2>
      <ul className="mb-10 space-y-2">
        {runs.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap gap-2">
              <span className="font-medium text-slate-900">{r.domainLabel}</span>
              <Badge variant="secondary">{r.mode}</Badge>
              <Badge variant="outline">{r.stage}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {r.quality
                ? `Overall ${r.quality.overall.toFixed(1)} · Fit ${r.quality.allocationFit.toFixed(1)} · Lift ${r.quality.coordinationLift.toFixed(1)}`
                : "In progress"}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-medium text-slate-900">Audit trail</h2>
      <ul className="space-y-2">
        {audits.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <span className="text-slate-400">{a.at}</span>
            <span className="mx-2 text-[var(--studio-emerald)]">{a.actor}</span>
            <span className="font-medium text-slate-800">{a.action}</span>
            <span className="ml-2 text-slate-500">{a.detail}</span>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
