"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";
import type { AuditEntry, LessonSession } from "@/store";

export default function RunsPage() {
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [lessons, setLessons] = useState<LessonSession[]>([]);
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const a = await api<{ items: AuditEntry[] }>(
        "/api/audits?page=1&pageSize=30",
      );
      setAudits(a.items);
      const l = await api<{ items: LessonSession[] }>(
        "/api/lessons?page=1&pageSize=30",
      );
      setLessons(l.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function exportCsv() {
    const csv = await api<string>("/api/audits?format=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "secure-tutor-audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJson() {
    const json = await api<string>("/api/lessons?format=json");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "secure-tutor-lessons.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Runs & audit"
      subtitle="Lesson history, audit trail, and export for education reviews."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={exportCsv} disabled={pending} variant="outline">
          Export audits CSV
        </Button>
        <Button onClick={exportJson} disabled={pending} variant="outline">
          Export lessons JSON
        </Button>
        <Button onClick={load} disabled={pending} variant="secondary">
          Refresh
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-medium text-stone-900">Recent lessons</h2>
          <ul className="space-y-2">
            {lessons.map((l) => (
              <li
                key={l.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3 text-sm"
              >
                <p className="font-medium">{l.courseLabel}</p>
                <p className="text-stone-500">
                  {l.mode} · {l.stage}
                  {l.quality ? ` · overall ${l.quality.overall.toFixed(1)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-medium text-stone-900">Audit log</h2>
          <ul className="space-y-2">
            {audits.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3 text-sm"
              >
                <p className="font-medium">
                  {a.action}{" "}
                  <span className="font-normal text-stone-500">
                    by {a.actor}
                  </span>
                </p>
                <p className="text-stone-500">{a.detail}</p>
                <p className="mt-1 text-xs text-stone-400">{a.at}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
