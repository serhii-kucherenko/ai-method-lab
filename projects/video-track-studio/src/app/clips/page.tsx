"use client";

import { FormEvent, useEffect, useState } from "react";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Clip } from "@/store";

export default function ClipsPage() {
  const [items, setItems] = useState<Clip[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [showLabel, setShowLabel] = useState("Friends");
  const [durationMin, setDurationMin] = useState("22");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: Clip[] }>(
      `/api/clips?q=${encodeURIComponent(search)}`,
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
      await api("/api/clips", {
        method: "POST",
        body: JSON.stringify({
          title,
          showLabel,
          durationMin: Number(durationMin) || 22,
          frameCount: 16,
          status: "ready",
          notes: "Captured from clips page",
        }),
      });
      setTitle("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Clips"
      subtitle="Register long-form episode clips before cast and track probes attach."
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
            Onboarding: scores are soft-sim fixtures — not production “watching”
            claims. Guide:{" "}
            <a
              className="text-[var(--studio-coral-deep)] underline-offset-2 hover:underline"
              href={GUIDE_PATH}
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
          placeholder="Clip title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Show label"
          value={showLabel}
          onChange={(e) => setShowLabel(e.target.value)}
        />
        <Input
          placeholder="Duration (min)"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
        />
        <Button type="submit">Add clip</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search clips"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No clips yet — create one to unlock characters, probes, and failures.
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {c.title}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {c.status} · {c.showLabel} · {c.durationMin}m · {c.frameCount}f
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{c.notes || "—"}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
