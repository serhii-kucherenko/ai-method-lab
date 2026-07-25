"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  monitorId: string;
  assayId: string;
  deckCoverage: number;
  assayConfidence: number;
  assayFit: number;
  protocolIntegrity: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [monitorId, setMonitorId] = useState("");
  const [assayId, setAssayId] = useState("");
  const [coverage, setCoverage] = useState("0.6");
  const [integrity, setIntegrity] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [runs, monitors, assays] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: { id: string }[] }>("/api/monitors"),
      api<{ items: { id: string }[] }>("/api/assays"),
    ]);
    setItems(runs.items);
    if (!monitorId && monitors.items[0]) {
      setMonitorId(monitors.items[0].id);
    }
    if (!assayId && assays.items[0]) setAssayId(assays.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          monitorId,
          assayId,
          deckCoverage: Number(coverage),
          assayConfidence: 0.7,
          assayFit: 0.72,
          protocolIntegrity: Number(integrity),
          reviewerNotes: "Soft-sim guard run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Guard runs"
      subtitle="Soft-sim protocol-integrity runs tied to monitors and assays."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label>Deck coverage</Label>
          <Input
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label>Protocol integrity</Label>
          <Input
            value={integrity}
            onChange={(e) => setIntegrity(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create guard run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ag-amber)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id.slice(0, 8)}…</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {r.deckCoverage} · integrity {r.protocolIntegrity} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
