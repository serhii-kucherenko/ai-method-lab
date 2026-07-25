"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  representationId: string;
  channelId: string;
  channelCoverage: number;
  transformerFidelity: number;
  activityGrounding: number;
  representationCompleteness: number;
  status: string;
};

type Repr = { id: string; label: string };
type Channel = { id: string; label: string };

export function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [reprs, setReprs] = useState<Repr[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [representationId, setRepresentationId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channelCoverage, setChannelCoverage] = useState("0.7");
  const [transformerFidelity, setTransformerFidelity] = useState("0.72");
  const [activityGrounding, setActivityGrounding] = useState("0.68");
  const [representationCompleteness, setRepresentationCompleteness] =
    useState("0.65");
  const [error, setError] = useState("");

  async function load() {
    const [runs, rep, ch] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Repr[] }>("/api/representations"),
      api<{ items: Channel[] }>("/api/channels"),
    ]);
    setItems(runs.items);
    setReprs(rep.items);
    setChannels(ch.items);
    if (!representationId && rep.items[0]) {
      setRepresentationId(rep.items[0].id);
    }
    if (!channelId && ch.items[0]) setChannelId(ch.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          representationId,
          channelId,
          channelCoverage: Number(channelCoverage),
          transformerFidelity: Number(transformerFidelity),
          activityGrounding: Number(activityGrounding),
          representationCompleteness: Number(representationCompleteness),
          runNotes: "Soft-sim accel run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Capture soft-sim proxies for channel coverage, fidelity, grounding, and completeness."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="repr">Representation</Label>
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
            {channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cc">Channel coverage</Label>
          <Input
            id="cc"
            value={channelCoverage}
            onChange={(e) => setChannelCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tf">Transformer fidelity</Label>
          <Input
            id="tf"
            value={transformerFidelity}
            onChange={(e) => setTransformerFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ag">Activity grounding</Label>
          <Input
            id="ag"
            value={activityGrounding}
            onChange={(e) => setActivityGrounding(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rc">Representation completeness</Label>
          <Input
            id="rc"
            value={representationCompleteness}
            onChange={(e) => setRepresentationCompleteness(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Create run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {r.channelCoverage} · fidelity {r.transformerFidelity} ·
              grounding {r.activityGrounding} · completeness{" "}
              {r.representationCompleteness} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
