"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  snomedCoded: { overall: number };
  privateTagBaseline: { overall: number };
};

export default function ScoreboardPage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Compare[] }>("/api/scoreboard")
      .then((d) => setItems(d.items))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ranked soft-sim compares by SNOMED-coded OCT recovery overall score."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run an A/B compare first.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((c, i) => (
            <li
              key={c.id}
              className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium">
                #{i + 1} {c.name}
              </div>
              <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {c.winner} · gap {c.gap} · SNOMED-coded{" "}
                {c.snomedCoded.overall} · private-tag{" "}
                {c.privateTagBaseline.overall}
              </div>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}
