"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  expanded: { overall: number };
  baseline: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Rank compares by expanded EIV overall — method-lab soft-sim leaderboard."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="mb-4 flex gap-2">
        <Button asChild variant="outline">
          <Link href="/compare">Run compare</Link>
        </Button>
        <Button asChild variant="outline">
          <a href="/api/export?format=csv">Export CSV</a>
        </Button>
      </div>
      <ol className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-lg border bg-white px-4 py-6 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            No compares yet — run an A/B compare to populate the board.
          </li>
        ) : (
          items.map((row, i) => (
            <li key={row.id} className="row-lift flex items-center gap-4 rounded-lg border bg-white px-4 py-3">
              <span className="font-[family-name:var(--font-display)] text-xl text-[var(--ef-teal)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {row.winner} · expanded {row.expanded.overall} · baseline{" "}
                  {row.baseline.overall} · gap {row.gap}
                </p>
              </div>
            </li>
          ))
        )}
      </ol>
    </StudioShell>
  );
}

export default ScoreboardPage;
