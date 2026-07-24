"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  DesignBrief,
  MaterialSequence,
  ThicknessPlan,
} from "@/store";

export default function ThicknessesPage() {
  const [items, setItems] = useState<ThicknessPlan[]>([]);
  const [briefs, setBriefs] = useState<DesignBrief[]>([]);
  const [sequences, setSequences] = useState<MaterialSequence[]>([]);
  const [briefId, setBriefId] = useState("");
  const [sequenceId, setSequenceId] = useState("");
  const [name, setName] = useState("");
  const [nm, setNm] = useState("92,48,110,52");
  const [continuity, setContinuity] = useState("0.75");
  const [error, setError] = useState("");

  async function load() {
    const [plans, br, seq] = await Promise.all([
      api<{ items: ThicknessPlan[] }>("/api/thicknesses"),
      api<{ items: DesignBrief[] }>("/api/briefs"),
      api<{ items: MaterialSequence[] }>("/api/materials"),
    ]);
    setItems(plans.items);
    setBriefs(br.items);
    setSequences(seq.items);
    if (!briefId && br.items[0]) setBriefId(br.items[0].id);
    if (!sequenceId && seq.items[0]) setSequenceId(seq.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const thicknessesNm = nm
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));
      await api("/api/thicknesses", {
        method: "POST",
        body: JSON.stringify({
          briefId,
          sequenceId,
          name,
          thicknessesNm,
          continuity: Number(continuity),
          fabricationFeasibility: 0.8,
          notes: "Continuous thickness plan",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Thickness plans"
      subtitle="Continuous nanometer thicknesses with fabrication feasibility."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={briefId}
          onChange={(e) => setBriefId(e.target.value)}
          required
        >
          {briefs.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={sequenceId}
          onChange={(e) => setSequenceId(e.target.value)}
          required
        >
          {sequences.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Plan name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Thicknesses nm (comma-separated)"
          value={nm}
          onChange={(e) => setNm(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Continuity"
          value={continuity}
          onChange={(e) => setContinuity(e.target.value)}
        />
        <Button type="submit">Add thickness plan</Button>
      </form>

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
                continuity {Math.round(c.continuity * 100)}% · fab{" "}
                {Math.round(c.fabricationFeasibility * 100)}%
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-slate-600">
              {c.thicknessesNm.map((n) => `${n} nm`).join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
