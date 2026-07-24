"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";
import type { AskSession, CorpusProject } from "@/store";

export default function AskPage() {
  const [corpora, setCorpora] = useState<CorpusProject[]>([]);
  const [corpusId, setCorpusId] = useState("");
  const [query, setQuery] = useState(
    "How does acetaminophen relate to liver injury?",
  );
  const [mode, setMode] = useState<"multi_step" | "single_shot">("multi_step");
  const [session, setSession] = useState<AskSession | null>(null);
  const [history, setHistory] = useState<AskSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    start(async () => {
      try {
        const c = await api<{ items: CorpusProject[] }>("/api/corpora?pageSize=50");
        setCorpora(c.items);
        if (c.items[0]) setCorpusId(c.items[0].id);
        const a = await api<{ items: AskSession[] }>("/api/ask?pageSize=20");
        setHistory(a.items);
        if (a.items[0]) setSession(a.items[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }, []);

  function ask() {
    start(async () => {
      try {
        const s = await api<AskSession>("/api/ask", {
          method: "POST",
          body: JSON.stringify({ corpusId, query, mode }),
        });
        setSession(s);
        const a = await api<{ items: AskSession[] }>("/api/ask?pageSize=20");
        setHistory(a.items);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "ask failed");
      }
    });
  }

  function exportTrail() {
    if (!session) return;
    const blob = new Blob(
      [JSON.stringify({ query: session.query, hopTrail: session.hopTrail, citations: session.citations }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trail-${session.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Ask playground"
      subtitle="Retrieve an answer with hop trail and citations from the consolidated graph."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form
          className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
        >
          <div className="space-y-2">
            <Label>Corpus</Label>
            <Select value={corpusId} onValueChange={setCorpusId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {corpora.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as typeof mode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multi_step">multi-step</SelectItem>
                <SelectItem value="single_shot">single-shot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="q">Query</Label>
            <Textarea
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={pending || !corpusId}>
            Ask
          </Button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>

        {session ? (
          <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-slate-900">Answer</h2>
              <Button size="sm" variant="outline" onClick={exportTrail}>
                Export trail JSON
              </Button>
            </div>
            <p className="text-slate-800">{session.answer}</p>
            <div>
              <h3 className="text-sm font-semibold text-teal-900">Hop trail</h3>
              <ol className="mt-2 space-y-2">
                {session.hopTrail.map((h, i) => (
                  <li
                    key={`${h.from}-${h.to}-${i}`}
                    className="animate-fade-up rounded-md bg-teal-50 px-3 py-2 text-sm"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {h.from} —{h.label}→ {h.to}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Citations</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {session.citations.map((c) => (
                  <li key={`${c.entityId}-${c.edgeLabel}`}>
                    {c.entityName}
                    {c.edgeLabel ? ` (${c.edgeLabel})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-semibold">Recent sessions</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          {history.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                className="text-left text-teal-800 underline-offset-2 hover:underline"
                onClick={() => setSession(h)}
              >
                {h.query}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
