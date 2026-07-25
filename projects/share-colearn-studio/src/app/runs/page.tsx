"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  reviewerId: string;
  labelSetId: string;
  clinicianAgreement: number;
  activitySignal: number;
  ehrCompleteness: number;
  labelStability: number;
  status: string;
};

export function RunsPage() {
  const [reviewers, setReviewers] = useState<Ref[]>([]);
  const [labels, setLabels] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [reviewerId, setReviewerId] = useState("");
  const [labelSetId, setLabelSetId] = useState("");
  const [clinicianAgreement, setClinicianAgreement] = useState("0.65");
  const [activitySignal, setActivitySignal] = useState("0.7");
  const [ehrCompleteness, setEhrCompleteness] = useState("0.72");
  const [labelStability, setLabelStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [r, l, runs] = await Promise.all([
      api<{ items: Ref[] }>("/api/reviewers"),
      api<{ items: Ref[] }>("/api/labels"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setReviewers(r.items);
    setLabels(l.items);
    setItems(runs.items);
    if (!reviewerId && r.items[0]) setReviewerId(r.items[0].id);
    if (!labelSetId && l.items[0]) setLabelSetId(l.items[0].id);
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
          reviewerId,
          labelSetId,
          clinicianAgreement: Number(clinicianAgreement),
          activitySignal: Number(activitySignal),
          ehrCompleteness: Number(ehrCompleteness),
          labelStability: Number(labelStability),
          reviewerNotes: "Soft-sim colearn run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Soft-sim colearn runs capturing agreement, activity, EHR, and stability proxies."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="reviewer">Reviewer</Label>
          <select
            id="reviewer"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
          >
            {reviewers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="labelSet">Label set</Label>
          <select
            id="labelSet"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={labelSetId}
            onChange={(e) => setLabelSetId(e.target.value)}
          >
            {labels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label ?? m.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="agree">Clinician agreement</Label>
          <Input
            id="agree"
            value={clinicianAgreement}
            onChange={(e) => setClinicianAgreement(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="activity">Activity signal</Label>
          <Input
            id="activity"
            value={activitySignal}
            onChange={(e) => setActivitySignal(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ehr">EHR completeness</Label>
          <Input
            id="ehr"
            value={ehrCompleteness}
            onChange={(e) => setEhrCompleteness(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stability">Label stability</Label>
          <Input
            id="stability"
            value={labelStability}
            onChange={(e) => setLabelStability(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create run</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--sc-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((row) => (
          <li
            key={row.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{row.id}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              agree {row.clinicianAgreement} · activity {row.activitySignal} ·
              ehr {row.ehrCompleteness} · stability {row.labelStability} ·{" "}
              {row.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
