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
  sampleEfficient: { overall: number };
  naiveGenerativeBaseline: { overall: number };
};

export default function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Sample-efficient vs naive");
  const [ids, setIds] = useState({
    optimizerId: "",
    targetId: "",
    runId: "",
  });
  const [error, setError] = useState("");

  async function load() {
    const [compares, optimizers, targets, runs] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: { id: string }[] }>("/api/optimizers"),
      api<{ items: { id: string }[] }>("/api/targets"),
      api<{ items: { id: string }[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setIds({
      optimizerId: optimizers.items[0]?.id ?? "",
      targetId: targets.items[0]?.id ?? "",
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
      subtitle="Sample-efficient generative optimization (A) vs naive generative baseline (B)."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label>Compare name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button onClick={run}>Run A/B compare</Button>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ms-teal)]">{error}</p>
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
                A sample-efficient{" "}
                <strong>{c.sampleEfficient.overall}</strong>
              </span>
              <span>
                B naive{" "}
                <strong>{c.naiveGenerativeBaseline.overall}</strong>
              </span>
              <span>
                Winner <strong>{c.winner}</strong> · gap {c.gap}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--studio-porcelain)]">
              <div
                className="score-bar h-full bg-[var(--ms-accent)]"
                style={{
                  width: `${Math.min(100, c.sampleEfficient.overall)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
