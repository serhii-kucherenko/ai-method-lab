"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  iterative: { overall: number };
  singlePass: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Seed DELT compare");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Iterative DELT optimize (A) vs single-pass library screen (B)."
    >
      <form onSubmit={run} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button disabled={busy}>{busy ? "Running…" : "Run compare"}</Button>
      </form>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li key={c.id} className="row-lift rounded-lg border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  winner {c.winner} · gap {c.gap}
                </p>
              </div>
              <div className="text-sm">
                <span className="mr-4">A iterative {c.iterative.overall}</span>
                <span>B single-pass {c.singlePass.overall}</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div className="score-bar h-full bg-[var(--el-sea)]" style={{ width: `${c.iterative.overall}%` }} />
              </div>
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div className="score-bar h-full bg-[var(--el-copper)]" style={{ width: `${c.singlePass.overall}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
