"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Score = {
  id: string;
  label: string;
  scoreText: string;
  successCondition: string;
  scoreChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function ScoresPage() {
  const [items, setItems] = useState<Score[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Synthetic Confidence Score gate");
  const [scoreText, setScoreText] = useState(
    "Gate flashy ungated AI steps before locking the route pack.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [scoreChannel, setScoreChannel] = useState("soft_sim_scs");
  const [error, setError] = useState("");

  async function load() {
    const [scores, ps] = await Promise.all([
      api<{ items: Score[] }>("/api/scores"),
      api<{ items: Pack[] }>("/api/routes"),
    ]);
    setItems(scores.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/scores", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          scoreText,
          successCondition,
          scoreChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Confidence scores"
      subtitle="Synthetic Confidence Score gates for soft-sim route locking."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Route pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="text">Score text</Label>
          <Input
            id="text"
            value={scoreText}
            onChange={(e) => setScoreText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Score channel</Label>
          <Input
            id="channel"
            value={scoreChannel}
            onChange={(e) => setScoreChannel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create score</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.scoreChannel} · {s.successCondition} · {s.status}
            </div>
            <p className="mt-1 text-sm">{s.scoreText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
