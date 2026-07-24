"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AugmentKind, AugmentPolicy } from "@/store";

const KINDS: AugmentKind[] = [
  "intensity",
  "elastic",
  "noise",
  "crop",
  "mix",
];

export default function AugmentPage() {
  const [items, setItems] = useState<AugmentPolicy[]>([]);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<AugmentKind>("intensity");
  const [strength, setStrength] = useState("0.35");
  const [preserveAnatomy, setPreserveAnatomy] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: AugmentPolicy[] }>(
      `/api/augment?q=${encodeURIComponent(q)}`,
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
      await api("/api/augment", {
        method: "POST",
        body: JSON.stringify({
          name,
          kind,
          strength: Number(strength),
          preserveAnatomy,
          notes: "Policy from augment page",
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
      title="Augmentation policies"
      subtitle="Anatomy-preserving intensity, elastic, noise, and crop policies for cardiac CT."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Policy name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value as AugmentKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Strength"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={preserveAnatomy}
            onChange={(e) => setPreserveAnatomy(e.target.checked)}
          />
          Preserve anatomy
        </label>
        <Button type="submit">Add policy</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter policies"
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
        {items.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{a.name}</span>
              <span className="text-xs text-slate-500">
                {a.kind} · strength {Math.round(a.strength * 100)}% ·{" "}
                {a.preserveAnatomy ? "anatomy-safe" : "aggressive"}
              </span>
            </div>
            {a.notes ? (
              <p className="mt-1 text-sm text-slate-500">{a.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
