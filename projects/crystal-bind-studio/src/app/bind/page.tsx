"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindProjection, CrystalPack } from "@/store";

export default function BindPage() {
  const [items, setItems] = useState<BindProjection[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [coherence, setCoherence] = useState("0.72");
  const [error, setError] = useState("");

  async function load() {
    const [binds, packRes] = await Promise.all([
      api<{ items: BindProjection[] }>("/api/bind"),
      api<{ items: CrystalPack[] }>("/api/packs"),
    ]);
    setItems(binds.items);
    setPacks(packRes.items);
    if (!packId && packRes.items[0]) setPackId(packRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/bind", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          coherence: Number(coherence),
          status: "draft",
          profile: "multimodal",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onScore(id: string) {
    setError("");
    try {
      await api("/api/bind", {
        method: "POST",
        body: JSON.stringify({ action: "score", id }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Bind-space explorer"
      subtitle="Project four descriptor lanes into a shared soft-sim bind space."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
          value={packId}
          onChange={(e) => setPackId(e.target.value)}
          required
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input placeholder="Projection name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Coherence 0-1" value={coherence} onChange={(e) => setCoherence(e.target.value)} />
        <Button type="submit">Project bind</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="bind-pulse rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {row.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Coherence {row.coherence} · cross-modal {row.crossModalAgreement} ·
              A {row.multimodalOverall ?? "—"} / B {row.singleOverall ?? "—"}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={() => onScore(row.id)}
            >
              Score A vs B
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
