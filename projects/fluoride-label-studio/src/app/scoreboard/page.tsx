"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  exchange: { overall: number };
  prosthetic: { overall: number };
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
      title="Labeling scoreboard"
      subtitle="Rank soft-sim compares by fast isotopic exchange overall."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((row, i) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
              <p className="font-semibold">
                #{i + 1} {row.name}
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                A {row.exchange.overall} · B {row.prosthetic.overall} · winner {row.winner} · gap {row.gap}
              </p>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
