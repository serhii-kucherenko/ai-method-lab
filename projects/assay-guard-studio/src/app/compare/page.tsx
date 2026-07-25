"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  assayAware: { overall: number };
  naiveProtocolRunner: { overall: number };
};

export default function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Assay-aware vs naive runner");
  const [ids, setIds] = useState({
    monitorId: "",
    assayId: "",
    runId: "",
  });
  const [error, setError] = useState("");

  async function load() {
    const [compares, monitors, assays, runs] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: { id: string }[] }>("/api/monitors"),
      api<{ items: { id: string }[] }>("/api/assays"),
      api<{ items: { id: string }[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setIds({
      monitorId: monitors.items[0]?.id ?? "",
      assayId: assays.items[0]?.id ?? "",
      runId: runs.items[0]?.id ?? "",
    });
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, ...ids, bias: "balanced" }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Assay-aware protocol validation (A) vs naive protocol runner (B)."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label>Compare name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button onClick={run}>Run A/B compare</Button>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ag-amber)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <span>
                A assay-aware <strong>{c.assayAware.overall}</strong>
              </span>
              <span>
                B naive <strong>{c.naiveProtocolRunner.overall}</strong>
              </span>
              <span>
                Winner <strong>{c.winner}</strong> · gap {c.gap}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--studio-white)]">
              <div
                className="score-bar h-full bg-[var(--ag-aqua)]"
                style={{
                  width: `${Math.min(100, c.assayAware.overall)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
