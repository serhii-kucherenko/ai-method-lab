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
type Entry = {
  id: string;
  streamId: string;
  term: string;
  coverage: number;
  priority: string;
};

export default function GlossaryPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [items, setItems] = useState<Entry[]>([]);
  const [streamId, setStreamId] = useState("");
  const [term, setTerm] = useState("");
  const [coverage, setCoverage] = useState("0.85");
  const [error, setError] = useState("");

  async function load() {
    const [s, g] = await Promise.all([
      api<{ items: Stream[] }>("/api/streams"),
      api<{ items: Entry[] }>(
        `/api/glossary${streamId ? `?streamId=${streamId}` : ""}`,
      ),
    ]);
    setStreams(s.items);
    setItems(g.items);
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
      await api("/api/glossary", {
        method: "POST",
        body: JSON.stringify({
          streamId,
          term: term || "TERM",
          coverage: Number(coverage) || 0.7,
          priority: "core",
        }),
      });
      setTerm("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Glossary"
      subtitle="Glossary coverage editor — terms that feed stream quality."
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
          <Label htmlFor="term">Term</Label>
          <Input
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cov">Coverage</Label>
          <Input
            id="cov"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Add term</Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No glossary entries yet — select a stream and add a term.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Term</th>
              <th>Coverage</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {items.map((g) => (
              <tr key={g.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{g.term}</td>
                <td>{g.coverage}</td>
                <td>{g.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
