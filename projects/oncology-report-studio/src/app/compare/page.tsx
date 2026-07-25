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
  multiLlmCollaborative: { overall: number };
  singleLlmBaseline: { overall: number };
};

export default function ComparePage() {
  const [collaborators, setCollaborators] = useState<Entity[]>([]);
  const [schemas, setSchemas] = useState<Entity[]>([]);
  const [drafts, setDrafts] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Multi-LLM vs single-LLM compare");
  const [collaboratorId, setCollaboratorId] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [draftId, setDraftId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [c, s, d, cmp] = await Promise.all([
      api<{ items: Entity[] }>("/api/collaborators"),
      api<{ items: Entity[] }>("/api/schemas"),
      api<{ items: Entity[] }>("/api/drafts"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setCollaborators(c.items);
    setSchemas(s.items);
    setDrafts(d.items);
    setItems(cmp.items);
    if (!collaboratorId && c.items[0]) setCollaboratorId(c.items[0].id);
    if (!schemaId && s.items[0]) setSchemaId(s.items[0].id);
    if (!draftId && d.items[0]) setDraftId(d.items[0].id);
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
          collaboratorId,
          schemaId,
          draftId,
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
      subtitle="Multi-LLM collaborative draft vs single-LLM baseline."
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
          <Label htmlFor="collab">Collaborator config</Label>
          <select
            id="collab"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={collaboratorId}
            onChange={(e) => setCollaboratorId(e.target.value)}
          >
            {collaborators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="schema">Report schema</Label>
          <select
            id="schema"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={schemaId}
            onChange={(e) => setSchemaId(e.target.value)}
          >
            {schemas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="draft">Report draft</Label>
          <select
            id="draft"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={draftId}
            onChange={(e) => setDraftId(e.target.value)}
          >
            {drafts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}
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
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="font-medium text-[var(--studio-ink)]">{c.name}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>
                  <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    Multi-LLM collaborative
                  </div>
                  <div className="mt-1 h-2 rounded bg-[var(--or-bone)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--or-teal)]"
                      style={{
                        width: `${c.multiLlmCollaborative.overall}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.multiLlmCollaborative.overall}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    Single-LLM baseline
                  </div>
                  <div className="mt-1 h-2 rounded bg-[var(--or-bone)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--or-coral)]"
                      style={{ width: `${c.singleLlmBaseline.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.singleLlmBaseline.overall}
                  </div>
                </div>
                <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
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
