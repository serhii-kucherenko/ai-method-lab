"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  Character,
  Clip,
  TrackCompare,
  TrackProbe,
} from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<TrackCompare[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [probes, setProbes] = useState<TrackProbe[]>([]);
  const [clipId, setClipId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [probeId, setProbeId] = useState("");
  const [name, setName] = useState("Track-aware vs fluency");
  const [error, setError] = useState("");

  async function load() {
    const [cmp, c, chars, p] = await Promise.all([
      api<{ items: TrackCompare[] }>("/api/compare"),
      api<{ items: Clip[] }>("/api/clips"),
      api<{ items: Character[] }>("/api/characters"),
      api<{ items: TrackProbe[] }>("/api/probes"),
    ]);
    setItems(cmp.items);
    setClips(c.items);
    setCharacters(chars.items);
    setProbes(p.items);
    if (!clipId && c.items[0]) setClipId(c.items[0].id);
    if (!characterId && chars.items[0]) setCharacterId(chars.items[0].id);
    if (!probeId && p.items[0]) setProbeId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, clipId, characterId, probeId }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Track-aware vs fluency"
      subtitle="Dual score panel — track-aware diagnosis quality vs benchmark-fluency baseline."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={clipId}
          onChange={(e) => setClipId(e.target.value)}
        >
          {clips.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
        >
          {characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={probeId}
          onChange={(e) => setProbeId(e.target.value)}
        >
          {probes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.probeKind} · {p.swapTargetName}
            </option>
          ))}
        </select>
        <Button type="submit">Run compare</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-[var(--studio-coral-deep)]">
                winner: {c.winner} · gap {c.gap}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  A · track-aware {c.trackAware.overall}
                </p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="score-bar h-full bg-[var(--studio-coral)]"
                    style={{
                      width: `${Math.min(100, c.trackAware.overall)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">
                  B · fluency-only {c.fluency.overall}
                </p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="score-bar h-full bg-[var(--studio-cyan)]"
                    style={{ width: `${Math.min(100, c.fluency.overall)}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
