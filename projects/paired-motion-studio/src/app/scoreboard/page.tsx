"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  fusion: { overall: number };
  egoOnly: { overall: number };
};

export function ScoreboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setRows((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load scoreboard");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ranked dual compares by distributed fusion overall."
    >
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[var(--studio-gauze-soft)]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Fusion</th>
              <th className="p-3">Ego-only</th>
              <th className="p-3">Winner</th>
              <th className="p-3">Gap</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.fusion.overall}</td>
                <td className="p-3">{r.egoOnly.overall}</td>
                <td className="p-3">{r.winner}</td>
                <td className="p-3">{r.gap}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={5}>
                  No compares yet — run A/B on /compare.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </StudioShell>
  );
}

export default ScoreboardPage;
