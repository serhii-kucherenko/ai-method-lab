"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { EcgCohort } from "@/store";

export default function CohortsPage() {
  const [items, setItems] = useState<EcgCohort[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [source, setSource] = useState("ptb-xl-style");
  const [leadCount, setLeadCount] = useState("12");
  const [hours, setHours] = useState("40");
  const [subjects, setSubjects] = useState("100");
  const [tags, setTags] = useState("long-tail,demo");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: EcgCohort[] }>(
        `/api/cohorts?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<EcgCohort>("/api/cohorts", {
          method: "POST",
          body: JSON.stringify({
            name,
            source,
            leadCount: Number(leadCount),
            hoursRecorded: Number(hours),
            subjectCount: Number(subjects),
            tags: tags.split(",").map((t) => t.trim()),
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="ECG cohorts"
      subtitle="Register ambulatory or nocturnal cohorts before long-tail train/eval."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <p className="font-medium">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Create a cohort with lead count and recorded hours.</li>
          <li>Review class balance on Classes.</li>
          <li>Open Train to run a long-tail-aware profile.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium">Create cohort</p>
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nocturnal PAC/PVC set"
            />
          </div>
          <div>
            <Label htmlFor="c-source">Source</Label>
            <Input
              id="c-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="leads">Leads</Label>
              <Input
                id="leads"
                value={leadCount}
                onChange={(e) => setLeadCount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subj">Subjects</Label>
              <Input
                id="subj"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim()} onClick={create}>
            Create cohort
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search source / tags"
            />
            <Button variant="outline" onClick={() => load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-3">
            {items.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-[family-name:var(--font-display)] text-lg">
                    {c.name}
                  </p>
                  <Badge variant="secondary">{c.source}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {c.leadCount} lead · {c.hoursRecorded}h · {c.subjectCount}{" "}
                  subjects
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
