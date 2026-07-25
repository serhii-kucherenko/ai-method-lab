"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ModelPack } from "@/store";

export default function PacksPage() {
  const [items, setItems] = useState<ModelPack[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [paramScaleB, setParamScaleB] = useState("3.2");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: ModelPack[] }>(
      `/api/packs?q=${encodeURIComponent(search)}`,
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
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          name,
          paramScaleB: Number(paramScaleB),
          status: "ready",
          notes: "Captured from packs page",
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
      title="Model packs"
      subtitle="Register constrained LLM packs before you assign channel bit widths."
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
            Onboarding: packs are soft-sim fixtures — not silicon inventory.
            Guide:{" "}
            <a
              className="text-[var(--studio-cyan-deep)] underline-offset-2 hover:underline"
              href="/docs/guides/62-edge-quant-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Pack name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Param scale (B)"
          value={paramScaleB}
          onChange={(e) => setParamScaleB(e.target.value)}
        />
        <Button type="submit">Add pack</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search packs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {p.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {p.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {p.paramScaleB}B · {p.layerCount} layers · skew{" "}
              {p.activationSkew.toFixed(2)}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-slate-500">
            No packs yet — add one to start channel planning.
          </li>
        ) : null}
      </ul>
    </StudioShell>
  );
}
