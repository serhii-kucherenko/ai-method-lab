"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, API_TOKEN } from "@/lib/client-api";
import type { AuditEntry, DeployRun } from "@/store";

export default function RunsPage() {
  const [runs, setRuns] = useState<DeployRun[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const r = await api<{ items: DeployRun[] }>("/api/runs?page=1&pageSize=30");
      setRuns(r.items);
      const a = await api<{ items: AuditEntry[] }>("/api/audits?limit=40");
      setAudits(a.items);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function exportCsv() {
    const res = await fetch("/api/audits?format=csv", {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const text = await res.text();
    const blob = new Blob([text], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJson() {
    const res = await fetch("/api/runs?format=json", {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const text = await res.text();
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "runs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs audit"
      subtitle="Inspect deploy runs and export CSV audits or JSON payloads."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" disabled={pending} onClick={exportCsv}>
          Export CSV
        </Button>
        <Button variant="outline" disabled={pending} onClick={exportJson}>
          Export JSON
        </Button>
        <Button variant="ghost" disabled={pending} onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-medium text-slate-100">Deploy runs</h2>
          <ul className="space-y-2">
            {runs.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3 text-sm"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="text-slate-100">{r.appLabel}</span>
                  <Badge variant="secondary">{r.mode}</Badge>
                  <Badge>{r.stage}</Badge>
                </div>
                <p className="mt-1 text-slate-500">
                  {r.quality
                    ? `overall ${r.quality.overall}`
                    : "in progress"}{" "}
                  · {r.updatedAt}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-medium text-slate-100">Audit trail</h2>
          <ul className="space-y-2">
            {audits.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3 text-sm text-slate-400"
              >
                <span className="text-slate-200">{a.action}</span> · {a.actor} ·{" "}
                {a.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
