"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CareEpisode, CompareResult } from "@/store";

export default function ComparePage() {
  const [episodes, setEpisodes] = useState<CareEpisode[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [episodeId, setEpisodeId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const eps = await api<{ items: CareEpisode[] }>("/api/episodes");
      setEpisodes(eps.items);
      if (!episodeId && eps.items[0]) setEpisodeId(eps.items[0].id);
      const res = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(res.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            episodeId,
            name: name || undefined,
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Grounded vs ungrounded"
      subtitle="Dual score: evidence-grounded plan quality (A) versus ungrounded LLM baseline (B)."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Episode</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={episodeId}
            onChange={(e) => setEpisodeId(e.target.value)}
          >
            {episodes.map((ep) => (
              <option key={ep.id} value={ep.id}>
                {ep.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Compare name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !episodeId}>
            Run compare
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-4"
          >
            <p className="font-medium text-slate-900">{c.name}</p>
            <p className="text-sm text-slate-500">Winner: {c.winner}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded border border-[var(--studio-line)] p-3 text-sm">
                <p className="font-semibold text-[var(--studio-green)]">
                  A · Evidence-grounded
                </p>
                <p>Overall {c.evidenceGrounded.overall}</p>
                <p>Stream {c.evidenceGrounded.streamFit}</p>
                <p>Knowledge {c.evidenceGrounded.knowledgeFit}</p>
                <p>Decision {c.evidenceGrounded.decisionQuality}</p>
              </div>
              <div className="rounded border border-[var(--studio-line)] p-3 text-sm">
                <p className="font-semibold text-slate-700">
                  B · Ungrounded LLM
                </p>
                <p>Overall {c.ungroundedLlm.overall}</p>
                <p>Stream {c.ungroundedLlm.streamFit}</p>
                <p>Knowledge {c.ungroundedLlm.knowledgeFit}</p>
                <p>Decision {c.ungroundedLlm.decisionQuality}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
