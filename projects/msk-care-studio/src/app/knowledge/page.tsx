"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CareEpisode, KnowledgeSource } from "@/store";

export default function KnowledgePage() {
  const [episodes, setEpisodes] = useState<CareEpisode[]>([]);
  const [items, setItems] = useState<KnowledgeSource[]>([]);
  const [episodeId, setEpisodeId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("guideline");
  const [citation, setCitation] = useState("");
  const [relevance, setRelevance] = useState("0.8");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const eps = await api<{ items: CareEpisode[] }>("/api/episodes");
      setEpisodes(eps.items);
      if (!episodeId && eps.items[0]) setEpisodeId(eps.items[0].id);
      const id = episodeId || eps.items[0]?.id;
      const res = await api<{ items: KnowledgeSource[] }>(
        `/api/knowledge${id ? `?episodeId=${id}` : ""}`,
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
        await api("/api/knowledge", {
          method: "POST",
          body: JSON.stringify({
            episodeId,
            name,
            kind,
            citation,
            relevance: Number(relevance),
          }),
        });
        setName("");
        setCitation("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Medical knowledge"
      subtitle="Attach guidelines, trials, protocols, and local knowledge used to ground decisions."
    >
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
          <Label>Source name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Kind</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="guideline">guideline</option>
            <option value="trial">trial</option>
            <option value="protocol">protocol</option>
            <option value="local_kb">local_kb</option>
          </select>
        </div>
        <div>
          <Label>Citation</Label>
          <Input
            value={citation}
            onChange={(e) => setCitation(e.target.value)}
          />
        </div>
        <div>
          <Label>Relevance (0–1)</Label>
          <Input
            value={relevance}
            onChange={(e) => setRelevance(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button
            onClick={create}
            disabled={pending || !name || !citation || !episodeId}
          >
            Add knowledge
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((k) => (
          <li
            key={k.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{k.name}</p>
            <p className="text-sm text-slate-500">
              {k.kind} · relevance {k.relevance.toFixed(2)} · {k.citation}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
