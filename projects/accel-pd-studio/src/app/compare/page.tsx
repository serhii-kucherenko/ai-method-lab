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
  transformer: { overall: number };
  baseline: { overall: number };
};

type Repr = { id: string; label: string };
type Channel = { id: string; label: string };
type Run = { id: string };

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [reprs, setReprs] = useState<Repr[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [name, setName] = useState("Transformer vs handcrafted PA baseline");
  const [representationId, setRepresentationId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, rep, ch, runData] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Repr[] }>("/api/representations"),
      api<{ items: Channel[] }>("/api/channels"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setReprs(rep.items);
    setChannels(ch.items);
    setRuns(runData.items);
    if (!representationId && rep.items[0]) {
      setRepresentationId(rep.items[0].id);
    }
    if (!channelId && ch.items[0]) setChannelId(ch.items[0].id);
    if (!runId && runData.items[0]) setRunId(runData.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          representationId,
          channelId,
          runId,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: multichannel_pa_transformer vs handcrafted_pa_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="repr">PA representation</Label>
          <select
            id="repr"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={representationId}
            onChange={(e) => setRepresentationId(e.target.value)}
          >
            {reprs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="channel">Channel</Label>
          <select
            id="channel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            {channels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · transformer{" "}
              {c.transformer.overall} · baseline {c.baseline.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--ap-teal)]"
                style={{
                  width: `${Math.min(100, c.transformer.overall)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
