"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Character, Clip, TrackProbe } from "@/store";

export default function ProbesPage() {
  const [items, setItems] = useState<TrackProbe[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [clipId, setClipId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [swapTarget, setSwapTarget] = useState("OtherCast");
  const [error, setError] = useState("");

  async function load() {
    const [probes, c, chars] = await Promise.all([
      api<{ items: TrackProbe[] }>("/api/probes"),
      api<{ items: Clip[] }>("/api/clips"),
      api<{ items: Character[] }>("/api/characters"),
    ]);
    setItems(probes.items);
    setClips(c.items);
    setCharacters(chars.items);
    if (!clipId && c.items[0]) setClipId(c.items[0].id);
    if (!characterId && chars.items[0]) setCharacterId(chars.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/probes", {
        method: "POST",
        body: JSON.stringify({
          clipId,
          characterId,
          probeKind: "name_swap",
          swapTargetName: swapTarget,
          sensitivity: 0.32,
          identityBind: 0.38,
          temporalCoverage: 0.52,
          fluencyPrior: 0.72,
          status: "running",
        }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Track probes"
      subtitle="Name-swap and identity-sensitivity probes — does the answer move when the named person changes?"
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
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
        <Input
          placeholder="Swap target name"
          value={swapTarget}
          onChange={(e) => setSwapTarget(e.target.value)}
        />
        <Button type="submit">Create name-swap probe</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {p.probeKind} → {p.swapTargetName}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {p.status} · sens {p.sensitivity} · bind {p.identityBind}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
