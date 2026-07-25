"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  optimizerId: string;
  targetId: string;
  campaignCoverage: number;
  targetConfidence: number;
  targetFit: number;
  sampleEfficiency: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [optimizerId, setOptimizerId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [coverage, setCoverage] = useState("0.6");
  const [efficiency, setEfficiency] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [runs, optimizers, targets] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: { id: string }[] }>("/api/optimizers"),
      api<{ items: { id: string }[] }>("/api/targets"),
    ]);
    setItems(runs.items);
    if (!optimizerId && optimizers.items[0]) {
      setOptimizerId(optimizers.items[0].id);
    }
    if (!targetId && targets.items[0]) setTargetId(targets.items[0].id);
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
          optimizerId,
          targetId,
          campaignCoverage: Number(coverage),
          targetConfidence: 0.7,
          targetFit: 0.72,
          sampleEfficiency: Number(efficiency),
          reviewerNotes: "Soft-sim sample run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Sample runs"
      subtitle="Soft-sim sample-efficiency runs tied to optimizers and targets."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label>Campaign coverage</Label>
          <Input
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label>Sample efficiency</Label>
          <Input
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create sample run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ms-teal)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id.slice(0, 8)}…</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {r.campaignCoverage} · efficiency {r.sampleEfficiency} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
