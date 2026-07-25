"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Video = {
  id: string;
  label: string;
  captureNotes: string;
  captureChannel: string;
  lockCondition: string;
  status: string;
};

export function VideosPage() {
  const [items, setItems] = useState<Video[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [captureNotes, setNotes] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Video[] }>(
            `/api/videos?q=${encodeURIComponent(query)}`,
          )
        ).items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load videos");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/videos", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          label,
          captureNotes,
          lockCondition: "lock_soft_sim",
          captureChannel: "soft_sim_async_video",
        }),
      });
      setLabel("");
      setNotes("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create video");
    }
  };

  return (
    <StudioShell
      title="Async videos"
      subtitle="Register asynchronous video captures that feed exam sessions."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="notes">Capture notes</Label>
          <Input
            id="notes"
            value={captureNotes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <Button>Create video</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search videos"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search videos"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((video) => (
              <article key={video.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{video.label}</h2>
                <p className="text-sm text-slate-600">
                  {video.captureChannel} · {video.lockCondition} · {video.status}
                </p>
                <p className="mt-1 text-sm">{video.captureNotes}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default VideosPage;
