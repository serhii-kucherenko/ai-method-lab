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
  failGate: { overall: number };
  correctnessOnly: { overall: number };
};

export default function ScoreboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Row[] }>("/api/scoreboard")
      .then((d) => setRows(d.items))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ranked fail-gate compares — highest taxonomy diagnosis overall first."
    >
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No compares yet —{" "}
          <Link href="/compare" className="text-[var(--studio-teal)] underline">
            run a dual compare
          </Link>
          .
        </p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r, idx) => (
            <li
              key={r.id}
              className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
            >
              <span>
                <strong>#{idx + 1}</strong> {r.name}
              </span>
              <span className="text-slate-600">
                A {r.failGate.overall.toFixed(1)} · B{" "}
                {r.correctnessOnly.overall.toFixed(1)} · {r.winner} · gap{" "}
                {r.gap}
              </span>
            </li>
          ))}
        </ol>
      )}
      <Button asChild variant="outline" className="mt-6">
        <Link href="/compare">Run another compare</Link>
      </Button>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
