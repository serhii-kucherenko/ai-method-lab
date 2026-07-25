"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  cooperative: { overall: number };
  meltingBaseline: { overall: number };
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
    <StudioShell title="Scoreboard" subtitle="Ranked dual compares by cooperative multi-domain overall score.">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : null}
      <ol className="space-y-3">
        {items.map((row, i) => (
          <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
            <p className="text-xs uppercase text-[var(--pd-teal)]">#{i + 1}</p>
            <h2 className="font-semibold">{row.name}</h2>
            <p className="text-sm">
              Winner {row.winner} · gap {row.gap} · cooperative {row.cooperative.overall} ·
              melting {row.meltingBaseline.overall}
            </p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default ScoreboardPage;
