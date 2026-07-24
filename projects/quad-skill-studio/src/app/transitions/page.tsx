"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  GaitTransition,
  QuadRobot,
  SkillKind,
  TransitionStatus,
} from "@/store";

const SKILLS: SkillKind[] = ["trot", "pace", "bound", "crawl", "climb"];
const STATUSES: TransitionStatus[] = ["draft", "reviewed", "smooth", "jerky"];

export default function TransitionsPage() {
  const [robots, setRobots] = useState<QuadRobot[]>([]);
  const [items, setItems] = useState<GaitTransition[]>([]);
  const [robotId, setRobotId] = useState("");
  const [name, setName] = useState("");
  const [fromSkill, setFromSkill] = useState<SkillKind>("trot");
  const [toSkill, setToSkill] = useState<SkillKind>("crawl");
  const [status, setStatus] = useState<TransitionStatus>("draft");
  const [smoothness, setSmoothness] = useState("0.75");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: QuadRobot[] }>("/api/robots")
      .then(async (r) => {
        setRobots(r.items);
        const id = r.items[0]?.id ?? "";
        setRobotId(id);
      })
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!robotId) return;
    api<GaitTransition[]>(
      `/api/transitions?robotId=${encodeURIComponent(robotId)}&q=${encodeURIComponent(q)}`,
    )
      .then((t) => setItems(Array.isArray(t) ? t : []))
      .catch((e) => setError(String(e)));
  }, [robotId, q]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/transitions", {
        method: "POST",
        body: JSON.stringify({
          robotId,
          name,
          fromSkill,
          toSkill,
          status,
          smoothness: Number(smoothness),
          notes: "Reviewed from transitions page",
        }),
      });
      setName("");
      const t = await api<GaitTransition[]>(
        `/api/transitions?robotId=${encodeURIComponent(robotId)}`,
      );
      setItems(Array.isArray(t) ? t : []);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Gait transitions"
      subtitle="Review skill switches — smoothness before the terrain forces a stall."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={robotId}
          onChange={(e) => setRobotId(e.target.value)}
          required
        >
          {robots.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Transition name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={fromSkill}
          onChange={(e) => setFromSkill(e.target.value as SkillKind)}
        >
          {SKILLS.map((k) => (
            <option key={k} value={k}>
              from {k}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={toSkill}
          onChange={(e) => setToSkill(e.target.value as SkillKind)}
        >
          {SKILLS.map((k) => (
            <option key={k} value={k}>
              to {k}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as TransitionStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Input
          placeholder="Smoothness 0–1"
          value={smoothness}
          onChange={(e) => setSmoothness(e.target.value)}
        />
        <Button type="submit" className="md:col-span-3">
          Add transition
        </Button>
      </form>
      <Input
        className="mb-4"
        placeholder="Filter transitions"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium text-stone-900">{t.name}</div>
            <div className="mt-1 text-sm text-stone-500">
              {t.fromSkill} → {t.toSkill} · {t.status} · smoothness{" "}
              {t.smoothness.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
