"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack } from "@/store";

export default function PacksPage() {
  const [items, setItems] = useState<CrystalPack[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("TiO2");
  const [spaceGroup, setSpaceGroup] = useState("I41/amd");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: CrystalPack[] }>(
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
          formula,
          spaceGroup,
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
      title="Crystal packs"
      subtitle="Register crystal packs before you attach multimodal descriptor lanes."
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
            Onboarding: packs and embeddings are soft-sim fixtures — not wet-lab
            inventory. Guide:{" "}
            <a
              className="text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
              href="/docs/guides/63-crystal-bind-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <Input placeholder="Pack name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Formula" value={formula} onChange={(e) => setFormula(e.target.value)} />
        <Input placeholder="Space group" value={spaceGroup} onChange={(e) => setSpaceGroup(e.target.value)} />
        <Button type="submit">Add pack</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input placeholder="Search packs" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button type="button" variant="secondary" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No packs yet — create one to unlock structure, diffraction, DOS, and language lanes.
        </p>
      ) : null}

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
              {p.formula} · {p.spaceGroup}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
