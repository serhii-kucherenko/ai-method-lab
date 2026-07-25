"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Lexicon = { id: string; label: string };
type Tokenizer = { id: string; label: string };
type Run = {
  id: string;
  tokenizerId: string;
  lexiconId: string;
  lexiconCoverage: number;
  expansionConfidence: number;
  scriptConfidence: number;
  subwordAgreement: number;
  reviewerNotes: string;
  status: string;
};

export default function EvalsPage() {
  const [lexicons, setLexicons] = useState<Lexicon[]>([]);
  const [tokenizers, setTokenizers] = useState<Tokenizer[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [tokenizerId, setTokenizerId] = useState("");
  const [lexiconId, setLexiconId] = useState("");
  const [lexiconCoverage, setLexiconCoverage] = useState("0.58");
  const [expansionConf, setExpansionConf] = useState("0.7");
  const [scriptConf, setScriptConf] = useState("0.74");
  const [agreement, setAgreement] = useState("0.68");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [a, s, r] = await Promise.all([
      api<{ items: Lexicon[] }>("/api/lexicons"),
      api<{ items: Tokenizer[] }>("/api/tokenizers"),
      api<{ items: Run[] }>("/api/evals"),
    ]);
    setLexicons(a.items);
    setTokenizers(s.items);
    setItems(r.items);
    if (!lexiconId && a.items[0]) setLexiconId(a.items[0].id);
    if (!tokenizerId && s.items[0]) setTokenizerId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/evals", {
        method: "POST",
        body: JSON.stringify({
          tokenizerId,
          lexiconId,
          lexiconCoverage: Number(lexiconCoverage),
          expansionConfidence: Number(expansionConf),
          scriptConfidence: Number(scriptConf),
          subwordAgreement: Number(agreement),
          reviewerNotes: notes,
        }),
      });
      setNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Eval runs"
      subtitle="Record expanded-lexicon soft-sim runs against a tokenizer and lexicon expansion."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
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
                {s.label}
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
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Lexicon coverage</Label>
          <Input
            id="cov"
            value={lexiconCoverage}
            onChange={(e) => setLexiconCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="expansionConf">Expansion confidence</Label>
          <Input
            id="expansionConf"
            value={expansionConf}
            onChange={(e) => setExpansionConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="scriptConf">Script confidence</Label>
          <Input
            id="scriptConf"
            value={scriptConf}
            onChange={(e) => setScriptConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="agreement">Subword agreement</Label>
          <Input
            id="agreement"
            value={agreement}
            onChange={(e) => setAgreement(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Reviewer notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create eval run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-stone-500">No eval runs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-stone-900">{r.id}</div>
              <div className="mt-1 text-sm text-stone-500">
                coverage {r.lexiconCoverage} · expansion {r.expansionConfidence}{" "}
                · script {r.scriptConfidence} · agreement {r.subwordAgreement}
              </div>
              {r.reviewerNotes ? (
                <p className="mt-1 text-sm text-stone-600">{r.reviewerNotes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
