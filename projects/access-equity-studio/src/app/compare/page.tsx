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
  equityAccess: { overall: number };
  accuracyOnly: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Pack lock compare");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load compares");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          equityGateId: "equity-demo",
          cohortId: "cohort-demo",
          screenId: "screen-demo",
          pathwayId: "pathway-demo",
          accessRunId: "run-demo",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Dual compare"
      subtitle="equity_access_task_sharing vs accuracy_only_classifier"
    >
      <form onSubmit={run} className="mb-8 max-w-md space-y-3 rounded-lg border bg-white p-4">
        <Label htmlFor="name">Compare name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button>Run A/B compare</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="space-y-3">
        {items.map((c) => (
          <article key={c.id} className="row-lift rounded-lg border bg-white p-4">
            <h2 className="font-semibold">{c.name}</h2>
            <p className="text-sm">
              Winner <span className="text-[var(--ae-teal)]">{c.winner}</span> ·
              gap {c.gap}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase">Equity-access</p>
                <div className="mt-1 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-full rounded-full bg-[var(--ae-teal)]"
                    style={{ width: `${c.equityAccess.overall}%` }}
                  />
                </div>
                <p className="mt-1 text-sm">{c.equityAccess.overall}</p>
              </div>
              <div>
                <p className="text-xs uppercase">Accuracy-only</p>
                <div className="mt-1 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-full rounded-full bg-[var(--ae-amber)]"
                    style={{ width: `${c.accuracyOnly.overall}%` }}
                  />
                </div>
                <p className="mt-1 text-sm">{c.accuracyOnly.overall}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default ComparePage;
