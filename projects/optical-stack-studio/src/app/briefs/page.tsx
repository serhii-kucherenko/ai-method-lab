"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BandKind, DesignBrief } from "@/store";

const BANDS: BandKind[] = [
  "visible",
  "nir",
  "uv",
  "broadband",
  "narrowband",
];

export default function BriefsPage() {
  const [items, setItems] = useState<DesignBrief[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [goalText, setGoalText] = useState("");
  const [bandKind, setBandKind] = useState<BandKind>("visible");
  const [clarity, setClarity] = useState("0.75");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: DesignBrief[] }>(
      `/api/briefs?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/briefs", {
        method: "POST",
        body: JSON.stringify({
          name,
          goalText,
          bandKind,
          clarity: Number(clarity),
          notes: "Captured from briefs page",
        }),
      });
      setName("");
      setGoalText("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Design briefs"
      subtitle="Open-vocabulary coating goals — free-form text, band, and clarity."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm the brief is free-form (not catalog-locked), and
            that this studio is a method-lab planner — not live fab or
            spectrometer hardware. Guide:{" "}
            <a
              className="text-[var(--studio-cyan)] underline-offset-2 hover:underline"
              href="/docs/guides/59-optical-stack-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Brief name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={bandKind}
          onChange={(e) => setBandKind(e.target.value as BandKind)}
        >
          {BANDS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          className="md:col-span-2"
          placeholder="Open-vocabulary goal (e.g. AR R&lt;0.5% 400–700 nm)"
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Clarity"
          value={clarity}
          onChange={(e) => setClarity(e.target.value)}
          required
        />
        <Button type="submit">Add brief</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search briefs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="text-xs text-slate-500">
                {c.bandKind} · clarity {Math.round(c.clarity * 100)}% ·{" "}
                {c.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{c.goalText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
