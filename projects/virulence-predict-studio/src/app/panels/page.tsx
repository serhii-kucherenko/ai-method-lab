"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { OrganismPanel } from "@/store";

type Page = {
  items: OrganismPanel[];
  total: number;
  page: number;
};

export default function PanelsPage() {
  const [data, setData] = useState<Page | null>(null);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [organism, setOrganism] = useState("");
  const [sampleSource, setSampleSource] = useState("");
  const [accessionTags, setAccessionTags] = useState("");
  const [sequenceCount, setSequenceCount] = useState("12");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      try {
        const res = await api<Page>(
          `/api/panels?q=${encodeURIComponent(search)}&pageSize=20`,
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

  function createPanel() {
    start(async () => {
      try {
        await api("/api/panels", {
          method: "POST",
          body: JSON.stringify({
            name,
            organism,
            sampleSource,
            accessionTags: accessionTags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            sequenceCount: Number(sequenceCount) || 1,
          }),
        });
        setName("");
        setOrganism("");
        setSampleSource("");
        setAccessionTags("");
        setSequenceCount("12");
        load(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "create_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Organism panels"
      subtitle="Sample workspaces with organism, source, and accession tags — start here before predicting."
    >
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <h2 className="font-medium text-slate-900">Onboarding checklist</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Create a panel for your organism / sample set</li>
          <li>Open Predict and run feature-integrated scoring</li>
          <li>Inspect Features, then Compare vs sequence-only</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search panels, organisms, accessions…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => load(q)} disabled={pending}>
          Search
        </Button>
      </div>

      <div className="mb-10 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <h2 className="font-medium text-slate-900 md:col-span-2">
          Create panel
        </h2>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="organism">Organism</Label>
          <Input
            id="organism"
            value={organism}
            onChange={(e) => setOrganism(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="source">Sample source</Label>
          <Input
            id="source"
            value={sampleSource}
            onChange={(e) => setSampleSource(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="count">Sequence count</Label>
          <Input
            id="count"
            value={sequenceCount}
            onChange={(e) => setSequenceCount(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="tags">Accession tags (comma-separated)</Label>
          <Input
            id="tags"
            value={accessionTags}
            onChange={(e) => setAccessionTags(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={createPanel} disabled={pending}>
            Create panel
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {(data?.items ?? []).map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-slate-900">{p.name}</h3>
              <Badge variant="secondary">{p.sequenceCount} sequences</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {p.organism} · {p.sampleSource}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.accessionTags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-500">
        {data ? `${data.total} panels` : "Loading…"}
      </p>
    </StudioShell>
  );
}
