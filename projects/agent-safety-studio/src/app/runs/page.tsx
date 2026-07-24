"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api, API_TOKEN } from "@/lib/client-api";
import type { AuditEntry } from "@/store";

export default function RunsPage() {
  const [items, setItems] = useState<AuditEntry[]>([]);
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: AuditEntry[] }>(
        "/api/audits?page=1&pageSize=30",
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function download(format: "csv" | "json-alerts") {
    const res = await fetch(`/api/audits?format=${format}`, {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "csv" ? "audits.csv" : "alerts.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Audit runs"
      subtitle="Export CSV audits and JSON alert snapshots for review."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" disabled={pending} onClick={load}>
          Refresh
        </Button>
        <Button variant="outline" onClick={() => download("csv")}>
          Export CSV audits
        </Button>
        <Button variant="outline" onClick={() => download("json-alerts")}>
          Export JSON alerts
        </Button>
      </div>
      <ul className="space-y-2">
        {items.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3 text-sm"
          >
            <p className="font-medium text-stone-900">
              {a.action} · {a.actor}
            </p>
            <p className="text-stone-500">{a.detail}</p>
            <p className="mt-1 text-xs text-stone-400">{a.at}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
