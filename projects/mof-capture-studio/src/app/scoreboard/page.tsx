"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  mof: { overall: number; confidence: number };
  conventional: { overall: number };
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
      subtitle="Rank compares by anionic MOF capture overall — soft-sim only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ol className="space-y-2">
        {items.map((row, i) => (
          <li key={row.id} className="row-lift flex items-baseline justify-between rounded-lg border bg-white px-4 py-3">
            <div>
              <span className="mr-3 font-[family-name:var(--font-display)] text-lg text-[var(--mc-teal)]">
                #{i + 1}
              </span>
              <span className="font-medium">{row.name}</span>
              <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.winner} · gap {row.gap} · confidence {row.mof.confidence}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>MOF {row.mof.overall}</p>
              <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Conventional {row.conventional.overall}
              </p>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            Run compares to populate the scoreboard.
          </p>
        ) : null}
      </ol>
    </StudioShell>
  );
}

export default ScoreboardPage;
