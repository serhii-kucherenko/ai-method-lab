"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { SlideCohort } from "@/store";

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<SlideCohort[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [organSite, setOrganSite] = useState("Breast");
  const [stainProtocol, setStainProtocol] = useState("H&E");
  const [tags, setTags] = useState("BRACS, demo");
  const [slideCount, setSlideCount] = useState("12");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh(search = q) {
    start(async () => {
      try {
        const data = await api<{ items: SlideCohort[] }>(
          `/api/cohorts?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
        );
        setCohorts(data.items);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  useEffect(() => {
    refresh("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createCohort() {
    start(async () => {
      try {
        await api("/api/cohorts", {
          method: "POST",
          body: JSON.stringify({
            name,
            organSite,
            stainProtocol,
            caseTags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            slideCount: Number(slideCount) || 1,
          }),
        });
        setName("");
        refresh(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Slide cohorts"
      subtitle="Group whole-slide images by organ site, stain, and case tags before embedding."
    >
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-white/80 p-4">
        <p className="font-medium text-stone-900">Onboarding checklist</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-600">
          <li>Create a cohort for your organ site and stain protocol.</li>
          <li>Open Embed to run a multi-signal or vision-only profile.</li>
          <li>Inspect slides, then compare signals on Compare.</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search organ / stain / tags"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => refresh(q)} disabled={pending}>
          Search
        </Button>
      </div>

      <div className="mb-10 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Create cohort</Label>
          <Input
            id="c-name"
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cohort name"
          />
        </div>
        <div>
          <Label htmlFor="c-organ">Organ site</Label>
          <Input
            id="c-organ"
            className="mt-1"
            value={organSite}
            onChange={(e) => setOrganSite(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c-stain">Stain protocol</Label>
          <Input
            id="c-stain"
            className="mt-1"
            value={stainProtocol}
            onChange={(e) => setStainProtocol(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c-tags">Case tags</Label>
          <Input
            id="c-tags"
            className="mt-1"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c-count">Slide count</Label>
          <Input
            id="c-count"
            className="mt-1"
            value={slideCount}
            onChange={(e) => setSlideCount(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={createCohort} disabled={pending || !name.trim()}>
            Create cohort
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {cohorts.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-stone-900">{c.name}</p>
            <p className="mt-1 text-sm text-stone-600">
              {c.organSite} · {c.stainProtocol} · {c.slideCount} slides ·{" "}
              {c.caseTags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
