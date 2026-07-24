"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { AuditEntry, PredictionRun } from "@/store";

type Page<T> = { items: T[]; total: number };

export default function RunsPage() {
  const [runs, setRuns] = useState<Page<PredictionRun> | null>(null);
  const [audits, setAudits] = useState<Page<AuditEntry> | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      try {
        const [r, a] = await Promise.all([
          api<Page<PredictionRun>>("/api/runs?pageSize=20"),
          api<Page<AuditEntry>>("/api/audits?pageSize=20"),
        ]);
        setRuns(r);
        setAudits(a);
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
    const csv = await api<string>("/api/audits?export=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJson() {
    const json = await api<string>("/api/runs?export=json");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prediction-runs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs audit"
      subtitle="Prediction history with stage trail, JSON run export, and CSV audit export."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={load} disabled={pending}>
          Refresh
        </Button>
        <Button variant="outline" onClick={() => void exportCsv()}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => void exportJson()}>
          Export JSON
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <h2 className="mb-3 font-medium text-slate-900">Prediction runs</h2>
      <ul className="mb-10 space-y-2">
        {(runs?.items ?? []).map((r) => (
          <li
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3 text-sm"
          >
            <span>
              {r.proteinLabel} · {r.mode.replace("_", " ")}
            </span>
            <Badge variant="secondary">{r.stage}</Badge>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-medium text-slate-900">Audit log</h2>
      <ul className="space-y-2">
        {(audits?.items ?? []).map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3 text-sm"
          >
            <span className="font-medium">{a.action}</span>
            <span className="text-slate-500"> · {a.actor} · {a.at}</span>
            <p className="mt-1 text-slate-600">{a.detail}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
