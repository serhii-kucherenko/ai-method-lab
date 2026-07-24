"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CareEpisode, StateStream } from "@/store";

export default function StreamsPage() {
  const [episodes, setEpisodes] = useState<CareEpisode[]>([]);
  const [items, setItems] = useState<StateStream[]>([]);
  const [episodeId, setEpisodeId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("vitals");
  const [freshness, setFreshness] = useState("0.8");
  const [coverage, setCoverage] = useState("0.75");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const eps = await api<{ items: CareEpisode[] }>("/api/episodes");
      setEpisodes(eps.items);
      if (!episodeId && eps.items[0]) setEpisodeId(eps.items[0].id);
      const id = episodeId || eps.items[0]?.id;
      const res = await api<{ items: StateStream[] }>(
        `/api/streams${id ? `?episodeId=${id}` : ""}`,
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
        await api("/api/streams", {
          method: "POST",
          body: JSON.stringify({
            episodeId,
            name,
            kind,
            freshness: Number(freshness),
            coverage: Number(coverage),
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
      title="Hospital state streams"
      subtitle="Link vitals, imaging, notes, orders, and therapy streams to each episode."
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
          <Label>Stream name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Kind</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="vitals">vitals</option>
            <option value="imaging">imaging</option>
            <option value="notes">notes</option>
            <option value="orders">orders</option>
            <option value="therapy">therapy</option>
          </select>
        </div>
        <div>
          <Label>Freshness (0–1)</Label>
          <Input
            value={freshness}
            onChange={(e) => setFreshness(e.target.value)}
          />
        </div>
        <div>
          <Label>Coverage (0–1)</Label>
          <Input
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !episodeId}>
            Link stream
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">
              <span className="animate-stream-tick inline-block h-2 w-2 rounded-full bg-[var(--studio-green)] mr-2" />
              {s.name}
            </p>
            <p className="text-sm text-slate-500">
              {s.kind} · freshness {s.freshness.toFixed(2)} · coverage{" "}
              {s.coverage.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
