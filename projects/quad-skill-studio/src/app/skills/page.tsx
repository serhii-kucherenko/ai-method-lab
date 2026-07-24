"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { MotorSkill, QuadRobot, SkillKind } from "@/store";

const KINDS: SkillKind[] = ["trot", "pace", "bound", "crawl", "climb"];

export default function SkillsPage() {
  const [robots, setRobots] = useState<QuadRobot[]>([]);
  const [items, setItems] = useState<MotorSkill[]>([]);
  const [robotId, setRobotId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<SkillKind>("trot");
  const [coverage, setCoverage] = useState("0.75");
  const [stability, setStability] = useState("0.8");
  const [error, setError] = useState("");

  async function bootstrap() {
    const r = await api<{ items: QuadRobot[] }>("/api/robots");
    setRobots(r.items);
    const id = r.items[0]?.id ?? "";
    setRobotId(id);
    if (id) {
      const skills = await api<MotorSkill[]>(
        `/api/skills?robotId=${encodeURIComponent(id)}`,
      );
      setItems(Array.isArray(skills) ? skills : []);
    }
  }

  useEffect(() => {
    bootstrap().catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!robotId) return;
    api<MotorSkill[]>(`/api/skills?robotId=${encodeURIComponent(robotId)}`)
      .then((s) => setItems(Array.isArray(s) ? s : []))
      .catch((e) => setError(String(e)));
  }, [robotId]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/skills", {
        method: "POST",
        body: JSON.stringify({
          robotId,
          name,
          kind,
          coverage: Number(coverage),
          stability: Number(stability),
          notes: "Curated from skills page",
        }),
      });
      setName("");
      const skills = await api<MotorSkill[]>(
        `/api/skills?robotId=${encodeURIComponent(robotId)}`,
      );
      setItems(Array.isArray(skills) ? skills : []);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Motor skills"
      subtitle="Multi-skill library — coverage and stability per gait for wild maps."
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
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value as SkillKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <Input
          placeholder="Coverage 0–1"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
        />
        <Input
          placeholder="Stability 0–1"
          value={stability}
          onChange={(e) => setStability(e.target.value)}
        />
        <Button type="submit">Add skill</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium text-stone-900">{s.name}</div>
            <div className="mt-1 text-sm text-stone-500">
              {s.kind} · coverage {s.coverage.toFixed(2)} · stability{" "}
              {s.stability.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
