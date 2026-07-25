"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  openMindedness: number;
  badgeClarity: number;
  topicBalance: number;
  packReadiness: number;
  runNotes: string;
  status: string;
};

export function RunsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [openMindedness, setOpenMindedness] = useState("0.7");
  const [badgeClarity, setBadgeClarity] = useState("0.65");
  const [topicBalance, setTopicBalance] = useState("0.68");
  const [packReadiness, setPackReadiness] = useState("0.6");
  const [runNotes, setRunNotes] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/runs")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          badgeId: "badge-demo",
          feedId: "feed-demo",
          topicId: "topic-demo",
          openMindedness: Number(openMindedness),
          badgeClarity: Number(badgeClarity),
          topicBalance: Number(topicBalance),
          packReadiness: Number(packReadiness),
          runNotes,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell title="Dialogue runs" subtitle="Soft-sim dialogue runs that feed dual productive vs engagement compares.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="om">Open-mindedness</Label>
          <Input id="om" value={openMindedness} onChange={(e) => setOpenMindedness(e.target.value)} />
          <Label htmlFor="bc">Badge clarity</Label>
          <Input id="bc" value={badgeClarity} onChange={(e) => setBadgeClarity(e.target.value)} />
          <Label htmlFor="tb">Topic balance</Label>
          <Input id="tb" value={topicBalance} onChange={(e) => setTopicBalance(e.target.value)} />
          <Label htmlFor="pr">Pack readiness</Label>
          <Input id="pr" value={packReadiness} onChange={(e) => setPackReadiness(e.target.value)} />
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
          <Button>Create run</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.id}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  open {row.openMindedness} · badge {row.badgeClarity} · topic {row.topicBalance} · ready {row.packReadiness}
                </p>
                {row.runNotes ? <p className="mt-1 text-sm">{row.runNotes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default RunsPage;
