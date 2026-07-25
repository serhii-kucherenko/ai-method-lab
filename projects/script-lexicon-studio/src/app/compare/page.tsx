"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  expandedGeezLexicon: { overall: number };
  baselineMultilingual: { overall: number };
};

export default function ComparePage() {
  const [tokenizers, setTokenizers] = useState<Entity[]>([]);
  const [lexicons, setLexicons] = useState<Entity[]>([]);
  const [runs, setRuns] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Expanded lexicon vs baseline compare");
  const [tokenizerId, setTokenizerId] = useState("");
  const [lexiconId, setLexiconId] = useState("");
  const [evalRunId, setEvalRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, a, r, c] = await Promise.all([
      api<{ items: Entity[] }>("/api/tokenizers"),
      api<{ items: Entity[] }>("/api/lexicons"),
      api<{ items: Entity[] }>("/api/evals"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setTokenizers(s.items);
    setLexicons(a.items);
    setRuns(r.items);
    setItems(c.items);
    if (!tokenizerId && s.items[0]) setTokenizerId(s.items[0].id);
    if (!lexiconId && a.items[0]) setLexiconId(a.items[0].id);
    if (!evalRunId && r.items[0]) setEvalRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          tokenizerId,
          lexiconId,
          evalRunId,
          bias: "balanced",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Expanded Ge'ez-script lexicon vs baseline multilingual tokenizer."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tokenizer">Tokenizer config</Label>
          <select
            id="tokenizer"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={tokenizerId}
            onChange={(e) => setTokenizerId(e.target.value)}
          >
            {tokenizers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="lexicon">Lexicon expansion</Label>
          <select
            id="lexicon"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={lexiconId}
            onChange={(e) => setLexiconId(e.target.value)}
          >
            {lexicons.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label ?? a.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Eval run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={evalRunId}
            onChange={(e) => setEvalRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-stone-500">No compares yet — run one above.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="font-medium text-stone-900">{c.name}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>
                  <div className="text-xs text-stone-500">
                    Expanded Ge&apos;ez lexicon
                  </div>
                  <div className="mt-1 h-2 rounded bg-stone-100">
                    <div
                      className="score-bar h-2 rounded bg-[var(--studio-teal)]"
                      style={{ width: `${c.expandedGeezLexicon.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.expandedGeezLexicon.overall}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">
                    Baseline multilingual
                  </div>
                  <div className="mt-1 h-2 rounded bg-stone-100">
                    <div
                      className="score-bar h-2 rounded bg-stone-400"
                      style={{ width: `${c.baselineMultilingual.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.baselineMultilingual.overall}
                  </div>
                </div>
                <div className="text-sm text-stone-600">
                  winner <strong>{c.winner}</strong> · gap {c.gap}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
