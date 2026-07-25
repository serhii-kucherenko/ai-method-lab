"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Draft = {
  id: string;
  collaboratorCoverage: number;
  findingConfidence: number;
  schemaConfidence: number;
  consensusAgreement: number;
  status: string;
};

export default function DraftsPage() {
  const [collaborators, setCollaborators] = useState<Entity[]>([]);
  const [schemas, setSchemas] = useState<Entity[]>([]);
  const [items, setItems] = useState<Draft[]>([]);
  const [collaboratorId, setCollaboratorId] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [coverage, setCoverage] = useState("0.55");
  const [finding, setFinding] = useState("0.65");
  const [schemaConf, setSchemaConf] = useState("0.7");
  const [consensus, setConsensus] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const [c, s, d] = await Promise.all([
      api<{ items: Entity[] }>("/api/collaborators"),
      api<{ items: Entity[] }>("/api/schemas"),
      api<{ items: Draft[] }>("/api/drafts"),
    ]);
    setCollaborators(c.items);
    setSchemas(s.items);
    setItems(d.items);
    if (!collaboratorId && c.items[0]) setCollaboratorId(c.items[0].id);
    if (!schemaId && s.items[0]) setSchemaId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/drafts", {
        method: "POST",
        body: JSON.stringify({
          collaboratorId,
          schemaId,
          collaboratorCoverage: Number(coverage),
          findingConfidence: Number(finding),
          schemaConfidence: Number(schemaConf),
          consensusAgreement: Number(consensus),
          reviewerNotes: "Soft-sim draft cues",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Report drafts"
      subtitle="Capture soft-sim collaborator coverage and finding cues before A/B compare."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="collab">Collaborator</Label>
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
          <Label htmlFor="cov">Collaborator coverage</Label>
          <Input
            id="cov"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="find">Finding confidence</Label>
          <Input
            id="find"
            value={finding}
            onChange={(e) => setFinding(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sch">Schema confidence</Label>
          <Input
            id="sch"
            value={schemaConf}
            onChange={(e) => setSchemaConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="con">Consensus agreement</Label>
          <Input
            id="con"
            value={consensus}
            onChange={(e) => setConsensus(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={() => create()}>Create draft</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((d) => (
          <li
            key={d.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{d.id}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {d.collaboratorCoverage} · findings{" "}
              {d.findingConfidence} · schema {d.schemaConfidence} · consensus{" "}
              {d.consensusAgreement} · {d.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
