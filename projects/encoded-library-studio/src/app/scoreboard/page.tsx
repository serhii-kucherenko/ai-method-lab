"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  iterative: { overall: number };
  singlePass: { overall: number };
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
      subtitle="Ranked iterative DELT soft-sim compares — method-lab only."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet. Run one from Compare.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((row, i) => (
            <li key={row.id} className="row-lift flex items-center justify-between gap-3 rounded-lg border bg-white p-4">
              <div>
                <p className="font-semibold">
                  #{i + 1} {row.name}
                </p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {row.winner} · gap {row.gap}
                </p>
              </div>
              <p className="text-sm">
                A {row.iterative.overall} / B {row.singlePass.overall}
              </p>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
