"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Character, Clip } from "@/store";

export default function CharactersPage() {
  const [items, setItems] = useState<Character[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [clipId, setClipId] = useState("");
  const [name, setName] = useState("");
  const [outfits, setOutfits] = useState("3");
  const [error, setError] = useState("");

  async function load() {
    const [chars, c] = await Promise.all([
      api<{ items: Character[] }>("/api/characters"),
      api<{ items: Clip[] }>("/api/clips"),
    ]);
    setItems(chars.items);
    setClips(c.items);
    if (!clipId && c.items[0]) setClipId(c.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/characters", {
        method: "POST",
        body: JSON.stringify({
          clipId,
          name,
          genderCue: "same",
          castRank: 1,
          outfitChangeCount: Number(outfits) || 1,
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
      title="Characters"
      subtitle="Named cast bound to long-form clips — the identity axis for track probes."
    >
      {clips.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          No clips yet — create a clip first so characters can bind.
        </p>
      ) : null}

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
        <Input
          placeholder="Character name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Outfit change count"
          value={outfits}
          onChange={(e) => setOutfits(e.target.value)}
        />
        <Button type="submit">Add character</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                rank {c.castRank} · outfits {c.outfitChangeCount} ·{" "}
                {c.genderCue}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">clip {c.clipId}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
