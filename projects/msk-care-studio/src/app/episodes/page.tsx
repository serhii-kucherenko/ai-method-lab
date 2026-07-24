"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CareEpisode } from "@/store";

export default function EpisodesPage() {
  const [items, setItems] = useState<CareEpisode[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [patientLabel, setPatientLabel] = useState("");
  const [focus, setFocus] = useState("joint_replacement");
  const [careStage, setCareStage] = useState("admission");
  const [episodeDays, setEpisodeDays] = useState("1");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(query = q) {
    start(async () => {
      const res = await api<{ items: CareEpisode[] }>(
        `/api/episodes?q=${encodeURIComponent(query)}`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/episodes", {
          method: "POST",
          body: JSON.stringify({
            name,
            patientLabel,
            focus,
            careStage,
            episodeDays: Number(episodeDays),
          }),
        });
        setName("");
        setPatientLabel("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Care episodes"
      subtitle="Register patient episodes before linking streams, knowledge, and pathways."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-white p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Create a care episode</li>
          <li>Link hospital state streams and knowledge sources</li>
          <li>Record grounded decisions and advance the pathway</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search episodes"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => load()} disabled={pending}>
          Search
        </Button>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Patient label</Label>
          <Input
            value={patientLabel}
            onChange={(e) => setPatientLabel(e.target.value)}
          />
        </div>
        <div>
          <Label>Focus</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          >
            <option value="joint_replacement">joint_replacement</option>
            <option value="spine">spine</option>
            <option value="sports_injury">sports_injury</option>
            <option value="trauma">trauma</option>
          </select>
        </div>
        <div>
          <Label>Care stage</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={careStage}
            onChange={(e) => setCareStage(e.target.value)}
          >
            <option value="admission">admission</option>
            <option value="acute">acute</option>
            <option value="rehab">rehab</option>
            <option value="discharge">discharge</option>
          </select>
        </div>
        <div>
          <Label>Episode days</Label>
          <Input
            value={episodeDays}
            onChange={(e) => setEpisodeDays(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button
            onClick={create}
            disabled={pending || !name || !patientLabel}
          >
            Add episode
          </Button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((ep) => (
          <li
            key={ep.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{ep.name}</p>
            <p className="text-sm text-slate-500">
              {ep.patientLabel} · {ep.focus} · {ep.careStage} · day{" "}
              {ep.episodeDays}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
