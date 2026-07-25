"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";

type Stream = { id: string; label: string };
type Segment = {
  id: string;
  streamId: string;
  glossText: string;
  boundaryConfidence: number;
  startMs: number;
  endMs: number;
  status: string;
};

export default function SentencesPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [items, setItems] = useState<Segment[]>([]);
  const [streamId, setStreamId] = useState("");
  const [glossText, setGlossText] = useState("");
  const [boundary, setBoundary] = useState("0.8");
  const [error, setError] = useState("");

  async function load() {
    const [s, seg] = await Promise.all([
      api<{ items: Stream[] }>("/api/streams"),
      api<{ items: Segment[] }>(
        `/api/sentences${streamId ? `?streamId=${streamId}` : ""}`,
      ),
    ]);
    setStreams(s.items);
    setItems(seg.items);
    if (!streamId && s.items[0]) setStreamId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!streamId) {
      setError("Pick a stream first");
      return;
    }
    try {
      await api("/api/sentences", {
        method: "POST",
        body: JSON.stringify({
          streamId,
          glossText: glossText || "HELLO",
          boundaryConfidence: Number(boundary) || 0.75,
          startMs: 0,
          endMs: 1600,
          status: "active",
        }),
      });
      setGlossText("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Sentences"
      subtitle="Sentence segment workspace — gloss cuts with boundary confidence."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label>Stream</Label>
          <Select value={streamId} onValueChange={setStreamId}>
            <SelectTrigger>
              <SelectValue placeholder="Stream" />
            </SelectTrigger>
            <SelectContent>
              {streams.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gloss">Gloss text</Label>
          <Input
            id="gloss"
            value={glossText}
            onChange={(e) => setGlossText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bc">Boundary confidence</Label>
          <Input
            id="bc"
            value={boundary}
            onChange={(e) => setBoundary(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={create}>Add segment</Button>
          <Button
            variant="outline"
            onClick={() => load().catch((e) => setError(String(e)))}
          >
            Refresh
          </Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No segments yet — pick a stream and add a gloss sentence.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Gloss</th>
              <th>Boundary</th>
              <th>Window</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{s.glossText}</td>
                <td>{s.boundaryConfidence}</td>
                <td>
                  {s.startMs}–{s.endMs} ms
                </td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
