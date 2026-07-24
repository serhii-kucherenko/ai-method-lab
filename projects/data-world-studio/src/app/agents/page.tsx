"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { AgentProfile, AgentStyle, Workspace } from "@/store";

const STYLES: AgentStyle[] = ["cautious", "balanced", "explorer"];

export default function AgentsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [items, setItems] = useState<AgentProfile[]>([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [name, setName] = useState("");
  const [style, setStyle] = useState<AgentStyle>("balanced");
  const [skill, setSkill] = useState("0.75");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: AgentProfile[] }>("/api/agents");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const ws = await api<{ items: Workspace[] }>(
        "/api/workspaces?page=1&pageSize=50",
      );
      setWorkspaces(ws.items);
      if (ws.items[0]) setWorkspaceId(ws.items[0].id);
      const agents = await api<{ items: AgentProfile[] }>("/api/agents");
      setItems(agents.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<AgentProfile>("/api/agents", {
          method: "POST",
          body: JSON.stringify({
            workspaceId,
            name,
            style,
            skill: Number(skill),
            notes,
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Agents"
      subtitle="Configure autonomous DS agent profiles with style and skill before rollouts."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Add agent</p>
          <div>
            <Label htmlFor="a-ws">Workspace</Label>
            <select
              id="a-ws"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="a-name">Name</Label>
            <Input
              id="a-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Planner-7"
            />
          </div>
          <div>
            <Label htmlFor="a-style">Style</Label>
            <select
              id="a-style"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={style}
              onChange={(e) => setStyle(e.target.value as AgentStyle)}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="a-skill">Skill (0–1)</Label>
            <Input
              id="a-skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="a-notes">Notes</Label>
            <Input
              id="a-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !workspaceId}
            onClick={create}
          >
            Add agent
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{a.name}</p>
                <Badge>{a.style}</Badge>
                <Badge variant="secondary">skill {a.skill}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {a.notes || "No notes"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
