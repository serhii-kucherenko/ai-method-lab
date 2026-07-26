"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  cfir: { overall: number; confidence: number };
  statusQuo: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Compare[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Rank soft-sim compares by CFIR co-design overall — lock only when honesty stays visible."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet. Run one on the Compare page.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((c, i) => (
            <li key={c.id} className="row-lift flex items-center gap-4 rounded-lg border bg-white px-4 py-3">
              <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--pi-teal)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  CFIR {c.cfir.overall} · status-quo {c.statusQuo.overall} · winner {c.winner} · gap {c.gap}
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
