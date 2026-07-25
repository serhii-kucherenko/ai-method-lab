"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  equityAccess: { overall: number };
  accuracyOnly: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load scoreboard");
    }
  };

  useEffect(() => { void load(); }, []);

  const exportCsv = async () => {
    const csv = await api<string>("/api/export?format=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "access-equity-compares.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StudioShell title="Scoreboard" subtitle="Ranked dual compares by equity-access task-sharing overall.">
      <div className="mb-4 flex gap-2">
        <Button type="button" variant="outline" onClick={() => void load()}>Refresh</Button>
        <Button type="button" onClick={() => void exportCsv()}>Export CSV</Button>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[var(--studio-gauze-soft)]">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Winner</th>
              <th className="px-3 py-2">Gap</th>
              <th className="px-3 py-2">Equity-access</th>
              <th className="px-3 py-2">Accuracy-only</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.winner}</td>
                <td className="px-3 py-2">{row.gap}</td>
                <td className="px-3 py-2">{row.equityAccess.overall}</td>
                <td className="px-3 py-2">{row.accuracyOnly.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StudioShell>
  );
}

export default ScoreboardPage;
