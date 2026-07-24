"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";
import type { CareDecision, CareEpisode } from "@/store";

export default function DecisionsPage() {
  const [episodes, setEpisodes] = useState<CareEpisode[]>([]);
  const [items, setItems] = useState<CareDecision[]>([]);
  const [episodeId, setEpisodeId] = useState("");
  const [name, setName] = useState("");
  const [rationale, setRationale] = useState("");
  const [groundingScore, setGroundingScore] = useState("0.75");
  const [status, setStatus] = useState("grounded");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const eps = await api<{ items: CareEpisode[] }>("/api/episodes");
      setEpisodes(eps.items);
      if (!episodeId && eps.items[0]) setEpisodeId(eps.items[0].id);
      const id = episodeId || eps.items[0]?.id;
      const res = await api<{ items: CareDecision[] }>(
        `/api/decisions${id ? `?episodeId=${id}` : ""}`,
      );
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
        await api("/api/decisions", {
          method: "POST",
          body: JSON.stringify({
            episodeId,
            name,
            rationale,
            groundingScore: Number(groundingScore),
            status,
          }),
        });
        setName("");
        setRationale("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Decision ledger"
      subtitle="Record evidence-grounded care decisions with rationale and grounding scores."
    >
      <div className="mb-4 flex gap-3">
        <a
          className="text-sm text-[var(--studio-green)] underline"
          href="/api/export/decisions"
        >
          Export decisions JSON
        </a>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={episodeId}
          onChange={(e) => setEpisodeId(e.target.value)}
        >
          {episodes.map((ep) => (
            <option key={ep.id} value={ep.id}>
              {ep.name}
            </option>
          ))}
        </select>
        <Button variant="outline" onClick={load} disabled={pending}>
          Refresh
        </Button>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Decision</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">draft</option>
            <option value="grounded">grounded</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Rationale</Label>
          <Textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
          />
        </div>
        <div>
          <Label>Grounding score (0–1)</Label>
          <Input
            value={groundingScore}
            onChange={(e) => setGroundingScore(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button
            onClick={create}
            disabled={pending || !name || !rationale || !episodeId}
          >
            Log decision
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((d) => (
          <li
            key={d.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{d.name}</p>
            <p className="text-sm text-slate-500">
              {d.status} · grounding {d.groundingScore.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-slate-600">{d.rationale}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
