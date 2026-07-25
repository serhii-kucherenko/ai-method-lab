"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ConsultCase, MultimodalTurn } from "@/store";

export default function TurnsPage() {
  const [items, setItems] = useState<MultimodalTurn[]>([]);
  const [cases, setCases] = useState<ConsultCase[]>([]);
  const [caseId, setCaseId] = useState("");
  const [label, setLabel] = useState("");
  const [patientText, setPatientText] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageRelevance, setImageRelevance] = useState("0.8");
  const [scrub, setScrub] = useState(0.8);
  const [error, setError] = useState("");

  async function load() {
    const [turns, caseRes] = await Promise.all([
      api<{ items: MultimodalTurn[] }>("/api/turns"),
      api<{ items: ConsultCase[] }>("/api/cases"),
    ]);
    setItems(turns.items);
    setCases(caseRes.items);
    if (!caseId && caseRes.items[0]) setCaseId(caseRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/turns", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          label,
          patientText,
          imageCaption,
          hasImage: true,
          imageRelevance: Number(imageRelevance),
          visualGrounding: scrub,
          status: "ready",
        }),
      });
      setLabel("");
      setPatientText("");
      setImageCaption("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Multimodal turns"
      subtitle="Pair patient text with image captions and scrub image relevance for the next reply."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <Input
          placeholder="Turn label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <Input
          className="md:col-span-2"
          placeholder="Patient text"
          value={patientText}
          onChange={(e) => setPatientText(e.target.value)}
        />
        <Input
          className="md:col-span-2"
          placeholder="Image caption / findings"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
        />
        <Input
          placeholder="Image relevance 0–1"
          value={imageRelevance}
          onChange={(e) => setImageRelevance(e.target.value)}
        />
        <div>
          <label className="mb-1 block text-xs text-slate-500">
            Visual grounding scrub: {scrub.toFixed(2)}
          </label>
          <input
            className="turn-scrub w-full"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={scrub}
            onChange={(e) => setScrub(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Add turn</Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {t.label}
              </h2>
              <span className="text-xs text-slate-500">
                img {t.imageRelevance} · ground {t.visualGrounding}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{t.patientText}</p>
            <p className="mt-1 text-sm text-slate-500">{t.imageCaption}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
