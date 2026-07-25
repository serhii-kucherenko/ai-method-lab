"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Run = {
  id: string;
  reasonerId: string;
  schemaId: string;
  pathwayCoverage: number;
  cueConfidence: number;
  schemaConfidence: number;
  reasoningDepth: number;
  status: string;
};

export default function RunsPage() {
  const [reasoners, setReasoners] = useState<Entity[]>([]);
  const [schemas, setSchemas] = useState<Entity[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [reasonerId, setReasonerId] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [pathwayCoverage, setPathwayCoverage] = useState("0.6");
  const [cueConfidence, setCueConfidence] = useState("0.7");
  const [schemaConfidence, setSchemaConfidence] = useState("0.72");
  const [reasoningDepth, setReasoningDepth] = useState("0.65");
  const [error, setError] = useState("");

  async function load() {
    const [r, s, runs] = await Promise.all([
      api<{ items: Entity[] }>("/api/reasoners"),
      api<{ items: Entity[] }>("/api/schemas"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setReasoners(r.items);
    setSchemas(s.items);
    setItems(runs.items);
    if (!reasonerId && r.items[0]) setReasonerId(r.items[0].id);
    if (!schemaId && s.items[0]) setSchemaId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          reasonerId,
          schemaId,
          pathwayCoverage: Number(pathwayCoverage),
          cueConfidence: Number(cueConfidence),
          schemaConfidence: Number(schemaConfidence),
          reasoningDepth: Number(reasoningDepth),
          reviewerNotes: "Soft-sim HCC run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="HCC runs"
      subtitle="Soft-sim runs that feed dual A/B compare."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="reasoner">Reasoner</Label>
          <select
            id="reasoner"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={reasonerId}
            onChange={(e) => setReasonerId(e.target.value)}
          >
            {reasoners.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label ?? r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="schema">Schema</Label>
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
          <Label htmlFor="pc">Pathway coverage</Label>
          <Input
            id="pc"
            value={pathwayCoverage}
            onChange={(e) => setPathwayCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cc">Cue confidence</Label>
          <Input
            id="cc"
            value={cueConfidence}
            onChange={(e) => setCueConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sc">Schema confidence</Label>
          <Input
            id="sc"
            value={schemaConfidence}
            onChange={(e) => setSchemaConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rd">Reasoning depth</Label>
          <Input
            id="rd"
            value={reasoningDepth}
            onChange={(e) => setReasoningDepth(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--hr-wine)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {r.pathwayCoverage} · cues {r.cueConfidence} · schema{" "}
              {r.schemaConfidence} · depth {r.reasoningDepth} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
