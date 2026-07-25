"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindProjection, RetrieveCompare } from "@/store";

export default function RetrievePage() {
  const [items, setItems] = useState<RetrieveCompare[]>([]);
  const [binds, setBinds] = useState<BindProjection[]>([]);
  const [bindId, setBindId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [retrieves, bindRes] = await Promise.all([
      api<{ items: RetrieveCompare[] }>("/api/retrieve"),
      api<{ items: BindProjection[] }>("/api/bind"),
    ]);
    setItems(retrieves.items);
    setBinds(bindRes.items);
    if (!bindId && bindRes.items[0]) setBindId(bindRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/retrieve", {
        method: "POST",
        body: JSON.stringify({ name, bindId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Retrieve compare"
      subtitle="Multimodal bind retrieve quality (A) versus single-modality baseline (B)."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
          value={bindId}
          onChange={(e) => setBindId(e.target.value)}
          required
        >
          {binds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Input placeholder="Compare name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit">Run retrieve</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="score-fill rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-[var(--studio-teal-deep)]">
                {row.winner}
              </span>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">A multimodal</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="h-full bg-[var(--studio-teal)] transition-all"
                    style={{ width: `${Math.min(100, row.multimodal.overall)}%` }}
                  />
                </div>
                <p className="mt-1 text-sm">{row.multimodal.overall}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">B single</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="h-full bg-[var(--studio-gold)] transition-all"
                    style={{ width: `${Math.min(100, row.single.overall)}%` }}
                  />
                </div>
                <p className="mt-1 text-sm">{row.single.overall}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">Gap {row.gap}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
