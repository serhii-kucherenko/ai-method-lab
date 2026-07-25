"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";

type Tokenizer = {
  id: string;
  label: string;
  tokenizerSummary: string;
  successCondition: string;
  evalChannel: string;
  status: string;
};

export default function TokenizersPage() {
  const [items, setItems] = useState<Tokenizer[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [evalChannel, setEvalChannel] = useState("soft_sim_nlp");
  const [condition, setCondition] = useState("script_positive");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Tokenizer[] }>(
      `/api/tokenizers?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/tokenizers", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled tokenizer config",
          tokenizerSummary:
            summary ||
            "Soft-sim multilingual SentencePiece baseline vs expanded Ge'ez lexicon.",
          successCondition: condition,
          evalChannel,
        }),
      });
      setLabel("");
      setSummary("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Tokenizer configs"
      subtitle="Attach baseline multilingual tokenizer cases that expanded lexicons can score against."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search tokenizer or channel"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Eval channel</Label>
          <Input
            id="channel"
            value={evalChannel}
            onChange={(e) => setEvalChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Tokenizer summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="condition">Success condition</Label>
          <Input
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create tokenizer config</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-stone-500">No tokenizer configs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => (
            <li
              key={s.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-stone-900">{s.label}</div>
              <div className="mt-1 text-sm text-stone-500">
                {s.evalChannel} · {s.successCondition} · {s.status}
              </div>
              <p className="mt-1 text-sm text-stone-600">{s.tokenizerSummary}</p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
