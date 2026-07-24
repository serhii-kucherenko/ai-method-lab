"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";
import type { AuditEntry, EvalRun } from "@/store";

export default function RunsPage() {
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const r = await api<{ items: EvalRun[] }>("/api/runs?pageSize=50");
      setRuns(r.items);
      const a = await api<{ items: AuditEntry[] }>("/api/audits?pageSize=30");
      setAudits(a.items);
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
    a.download = "pathology-audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJson() {
    const json = await api<string>("/api/runs?format=json");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathology-runs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs audit"
      subtitle="Review embed runs and export audit trails for research notebooks."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={refresh} disabled={pending}>
          Refresh
        </Button>
        <Button onClick={exportCsv}>Export CSV</Button>
        <Button variant="secondary" onClick={exportJson}>
          Export JSON
        </Button>
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-xl">
        Eval runs
      </h2>
      <ul className="mt-3 space-y-2">
        {runs.map((r) => (
          <li
            key={r.id}
            className="rounded border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          >
            {r.slideLabel} · {r.mode} · {r.stage}
            {r.quality ? ` · overall ${r.quality.overall}` : ""}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-[family-name:var(--font-display)] text-xl">
        Audit log
      </h2>
      <ul className="mt-3 space-y-2">
        {audits.map((a) => (
          <li
            key={a.id}
            className="rounded border border-[var(--studio-line)] bg-white px-3 py-2 text-sm text-stone-700"
          >
            <span className="text-stone-500">{a.at}</span> · {a.actor} ·{" "}
            {a.action}: {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
