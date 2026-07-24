"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AgentConfig, AgentRole } from "@/store";

const ROLES: AgentRole[] = [
  "proposer",
  "challenger",
  "referee",
  "synthesizer",
];

export default function AgentsPage() {
  const [items, setItems] = useState<AgentConfig[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<AgentRole>("challenger");
  const [temperature, setTemperature] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: AgentConfig[] }>("/api/agents");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/agents", {
        method: "POST",
        body: JSON.stringify({
          name,
          role,
          temperature: Number(temperature),
          notes: "Configured from agents page",
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
      title="Agent roles"
      subtitle="Configure proposers, challengers, referees, and synthesizers for game-aware checks."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Agent name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as AgentRole)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.1"
          placeholder="Temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <Button type="submit">Add agent</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {item.role} · temp {item.temperature}
            </p>
            {item.notes ? (
              <p className="mt-2 text-sm text-stone-500">{item.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
