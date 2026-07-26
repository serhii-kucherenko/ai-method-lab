"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  structure: { overall: number; confidence: number };
  library: { overall: number };
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
      subtitle="Ranked soft-sim compares — structure-based DHODH vs naive library baseline."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((row, i) => (
            <li key={row.id} className="row-lift flex items-center gap-4 rounded-lg border bg-white px-4 py-3">
              <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--ds-teal)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  winner {row.winner} · gap {row.gap} · structure {row.structure.overall} ·
                  library {row.library.overall} · conf {row.structure.confidence}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
