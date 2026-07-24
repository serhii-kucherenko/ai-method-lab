"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  DesignBrief,
  MultilayerStack,
  SpectrumReview,
} from "@/store";

export default function SpectraPage() {
  const [items, setItems] = useState<SpectrumReview[]>([]);
  const [briefs, setBriefs] = useState<DesignBrief[]>([]);
  const [stacks, setStacks] = useState<MultilayerStack[]>([]);
  const [briefId, setBriefId] = useState("");
  const [stackId, setStackId] = useState("");
  const [name, setName] = useState("");
  const [fit, setFit] = useState("0.8");
  const [error, setError] = useState("");

  async function load() {
    const [sp, br, st] = await Promise.all([
      api<{ items: SpectrumReview[] }>("/api/spectra"),
      api<{ items: DesignBrief[] }>("/api/briefs"),
      api<{ items: MultilayerStack[] }>("/api/stacks"),
    ]);
    setItems(sp.items);
    setBriefs(br.items);
    setStacks(st.items);
    if (!briefId && br.items[0]) setBriefId(br.items[0].id);
    if (!stackId && st.items[0]) setStackId(st.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/spectra", {
        method: "POST",
        body: JSON.stringify({
          briefId,
          stackId,
          name,
          status: "predicted",
          spectrumFit: Number(fit),
          angleTolerance: 0.72,
          absorptionLoss: 0.2,
          notes: "Predicted spectrum review",
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
      title="Spectrum review"
      subtitle="Predicted R/T fit, AOI tolerance, and absorption — soft simulation."
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
          value={stackId}
          onChange={(e) => setStackId(e.target.value)}
          required
        >
          {stacks.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Review name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Spectrum fit"
          value={fit}
          onChange={(e) => setFit(e.target.value)}
        />
        <Button type="submit" className="md:col-span-2 md:w-fit">
          Add spectrum review
        </Button>
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
              <span className="text-xs text-slate-500">{c.status}</span>
            </div>
            <div className="mt-3 animate-spectrum-sweep h-2 overflow-hidden rounded bg-slate-200">
              <div
                className="h-full rounded bg-gradient-to-r from-[var(--studio-cyan)] via-white to-[var(--studio-magenta)]"
                style={{ width: `${Math.round(c.spectrumFit * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              fit {Math.round(c.spectrumFit * 100)}% · AOI{" "}
              {Math.round(c.angleTolerance * 100)}% · absorption{" "}
              {Math.round(c.absorptionLoss * 100)}%
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
