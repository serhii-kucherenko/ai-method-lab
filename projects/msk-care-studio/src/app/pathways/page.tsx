"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CareEpisode, CarePathway } from "@/store";

export default function PathwaysPage() {
  const [episodes, setEpisodes] = useState<CareEpisode[]>([]);
  const [items, setItems] = useState<CarePathway[]>([]);
  const [episodeId, setEpisodeId] = useState("");
  const [name, setName] = useState("");
  const [progress, setProgress] = useState("0.3");
  const [rehabTarget, setRehabTarget] = useState("0.7");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const eps = await api<{ items: CareEpisode[] }>("/api/episodes");
      setEpisodes(eps.items);
      if (!episodeId && eps.items[0]) setEpisodeId(eps.items[0].id);
      const id = episodeId || eps.items[0]?.id;
      const res = await api<{ items: CarePathway[] }>(
        `/api/pathways${id ? `?episodeId=${id}` : ""}`,
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
        await api("/api/pathways", {
          method: "POST",
          body: JSON.stringify({
            episodeId,
            name,
            progress: Number(progress),
            rehabTarget: Number(rehabTarget),
            status,
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
      title="Care pathways"
      subtitle="Track admission → acute → rehab progress and rehab readiness targets."
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
          <Label>Pathway name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="planned">planned</option>
            <option value="active">active</option>
            <option value="complete">complete</option>
          </select>
        </div>
        <div>
          <Label>Progress (0–1)</Label>
          <Input
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </div>
        <div>
          <Label>Rehab target (0–1)</Label>
          <Input
            value={rehabTarget}
            onChange={(e) => setRehabTarget(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !episodeId}>
            Add pathway
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-4">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{p.name}</p>
            <p className="text-sm text-slate-500">
              {p.status} · progress {p.progress.toFixed(2)} · rehab target{" "}
              {p.rehabTarget.toFixed(2)}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded bg-[var(--studio-green)] animate-pathway-progress"
                style={{
                  ["--pathway-w" as string]: `${Math.round(p.progress * 100)}%`,
                  width: `${Math.round(p.progress * 100)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
