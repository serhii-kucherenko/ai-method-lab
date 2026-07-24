"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { DiseaseProgram } from "@/store";

type Page = {
  items: DiseaseProgram[];
  total: number;
  page: number;
};

export default function ProgramsPage() {
  const [data, setData] = useState<Page | null>(null);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [indication, setIndication] = useState("");
  const [meshTags, setMeshTags] = useState("");
  const [targetName, setTargetName] = useState("");
  const [targetUniprot, setTargetUniprot] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      try {
        const res = await api<Page>(
          `/api/programs?q=${encodeURIComponent(search)}&pageSize=20`,
        );
        setData(res);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createProgram() {
    start(async () => {
      try {
        await api("/api/programs", {
          method: "POST",
          body: JSON.stringify({
            name,
            indication,
            meshTags: meshTags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            targetName,
            targetUniprot,
          }),
        });
        setName("");
        setIndication("");
        setMeshTags("");
        setTargetName("");
        setTargetUniprot("");
        load(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "create_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Disease programs"
      subtitle="Indication workspaces with MeSH tags and protein targets — start here before generating."
    >
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <h2 className="font-medium text-slate-900">Onboarding checklist</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Create a program for your indication</li>
          <li>Open Generate and run disease-aware conditioning</li>
          <li>Review ranked molecules in Library, then Compare vs blind</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search programs, targets, MeSH…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => load(q)} disabled={pending}>
          Search
        </Button>
      </div>

      <div className="mb-10 grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Program name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="indication">Indication</Label>
          <Input
            id="indication"
            value={indication}
            onChange={(e) => setIndication(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="mesh">MeSH tags (comma-separated)</Label>
          <Input
            id="mesh"
            value={meshTags}
            onChange={(e) => setMeshTags(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="target">Target name</Label>
          <Input
            id="target"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="uniprot">UniProt ID</Label>
          <Input
            id="uniprot"
            value={targetUniprot}
            onChange={(e) => setTargetUniprot(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={createProgram} disabled={pending}>
            Create program
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-4">
        {(data?.items ?? []).map((p, i) => (
          <li
            key={p.id}
            className="animate-cand rounded-lg border border-[var(--studio-line)] bg-white p-4"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                {p.name}
              </h3>
              <Badge variant="secondary">{p.indication}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Target: {p.targetName} ({p.targetUniprot || "n/a"})
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.meshTags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-500">
        {data ? `${data.total} programs` : "Loading…"}
      </p>
    </StudioShell>
  );
}
