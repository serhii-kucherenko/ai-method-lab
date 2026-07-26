"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  ose: { overall: number };
  openLam: { overall: number };
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
      subtitle="Rank soft-sim compares by OSE overall — lock when OSE beats open laminectomy with honesty intact."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((row, i) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">
                #{i + 1} {row.name}
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.winner} · gap {row.gap} · OSE {row.ose.overall} · open{" "}
                {row.openLam.overall}
              </p>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
