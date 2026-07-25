"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  ConsultCase,
  ConsultQuality,
  MultimodalTurn,
  ResponseScoreRecord,
} from "@/store";

export default function ScoresPage() {
  const [items, setItems] = useState<ResponseScoreRecord[]>([]);
  const [cases, setCases] = useState<ConsultCase[]>([]);
  const [turns, setTurns] = useState<MultimodalTurn[]>([]);
  const [caseId, setCaseId] = useState("");
  const [turnId, setTurnId] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<{
    multimodal: ConsultQuality;
    textOnly: ConsultQuality;
  } | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [scores, caseRes, turnRes] = await Promise.all([
      api<{ items: ResponseScoreRecord[] }>("/api/scores"),
      api<{ items: ConsultCase[] }>("/api/cases"),
      api<{ items: MultimodalTurn[] }>("/api/turns"),
    ]);
    setItems(scores.items);
    setCases(caseRes.items);
    setTurns(turnRes.items);
    if (!caseId && caseRes.items[0]) setCaseId(caseRes.items[0].id);
    if (!turnId && turnRes.items[0]) setTurnId(turnRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/scores", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          turnId,
          name,
          clinicalCoherence: 0.75,
          safetyDiscipline: 0.78,
          turnClarity: 0.72,
          status: "computed",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onPreview() {
    setError("");
    try {
      const turn = turns.find((t) => t.id === turnId);
      const c = cases.find((x) => x.id === caseId);
      const res = await api<{
        multimodal: ConsultQuality;
        textOnly: ConsultQuality;
      }>("/api/scores", {
        method: "POST",
        body: JSON.stringify({
          preview: {
            imageRelevance: turn?.imageRelevance ?? 0.8,
            visualGrounding: turn?.visualGrounding ?? 0.75,
            clinicalCoherence: 0.75,
            turnClarity: 0.72,
            safetyDiscipline: 0.78,
            textFluency: 0.3,
            departmentFit: 0.76,
            historyCoverage: 0.7,
            urgencyRecognition: 0.68,
            hallucinationRisk: 0.2,
            department: c?.department ?? "general",
            plan: "multimodal",
          },
        }),
      });
      setPreview(res);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Next-response scores"
      subtitle="Record and preview dual scores — multimodal-aware plan quality vs text-only baseline."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={turnId}
          onChange={(e) => setTurnId(e.target.value)}
        >
          {turns.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <Input
          className="md:col-span-2"
          placeholder="Score name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <Button type="submit">Save score</Button>
          <Button type="button" variant="outline" onClick={onPreview}>
            Preview dual score
          </Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      {preview ? (
        <div className="score-rise mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h3 className="font-[family-name:var(--font-display)] text-lg">
              A · Multimodal
            </h3>
            <p className="mt-2 text-3xl text-[var(--studio-mint-deep)]">
              {preview.multimodal.overall}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              visual {preview.multimodal.visualFidelity} · clinical{" "}
              {preview.multimodal.clinicalPlan} · safety{" "}
              {preview.multimodal.safetyScore}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h3 className="font-[family-name:var(--font-display)] text-lg">
              B · Text-only
            </h3>
            <p className="mt-2 text-3xl text-slate-700">
              {preview.textOnly.overall}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              visual {preview.textOnly.visualFidelity} · clinical{" "}
              {preview.textOnly.clinicalPlan} · safety{" "}
              {preview.textOnly.safetyScore}
            </p>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {s.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {s.status} · clinical {s.clinicalCoherence} · safety{" "}
              {s.safetyDiscipline} · clarity {s.turnClarity}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
