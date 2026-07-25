"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { LeaderboardEntry } from "@/store";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardEntry[]>([]);
  const [modelName, setModelName] = useState("");
  const [promptVariant, setPromptVariant] = useState("image-first");
  const [multimodalAvg, setMultimodalAvg] = useState("70");
  const [textOnlyAvg, setTextOnlyAvg] = useState("48");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: LeaderboardEntry[] }>("/api/leaderboard");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/leaderboard", {
        method: "POST",
        body: JSON.stringify({
          modelName,
          promptVariant,
          multimodalAvg: Number(multimodalAvg),
          textOnlyAvg: Number(textOnlyAvg),
        }),
      });
      setModelName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Model leaderboard"
      subtitle="Rank models and prompt variants by multimodal vs text-only gap."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Model name"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          required
        />
        <Input
          placeholder="Prompt variant"
          value={promptVariant}
          onChange={(e) => setPromptVariant(e.target.value)}
          required
        />
        <Input
          placeholder="Multimodal avg"
          value={multimodalAvg}
          onChange={(e) => setMultimodalAvg(e.target.value)}
        />
        <Input
          placeholder="Text-only avg"
          value={textOnlyAvg}
          onChange={(e) => setTextOnlyAvg(e.target.value)}
        />
        <div className="md:col-span-2">
          <Button type="submit">Upsert row</Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <div className="overflow-x-auto rounded-lg border border-[var(--studio-line)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--studio-panel)] text-slate-500">
            <tr>
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2">Prompt</th>
              <th className="px-3 py-2">A multimodal</th>
              <th className="px-3 py-2">B text-only</th>
              <th className="px-3 py-2">Gap</th>
              <th className="px-3 py-2">Runs</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t border-[var(--studio-line)]">
                <td className="px-3 py-2 font-medium">{r.modelName}</td>
                <td className="px-3 py-2">{r.promptVariant}</td>
                <td className="px-3 py-2 text-[var(--studio-mint-deep)]">
                  {r.multimodalAvg}
                </td>
                <td className="px-3 py-2">{r.textOnlyAvg}</td>
                <td className="px-3 py-2">{r.gap}</td>
                <td className="px-3 py-2">{r.runs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StudioShell>
  );
}
