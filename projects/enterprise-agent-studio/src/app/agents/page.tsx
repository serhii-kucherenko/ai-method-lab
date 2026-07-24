"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { AgentRole, AgentRoleKind, ErpDomain } from "@/store";

const KINDS: AgentRoleKind[] = [
  "planner",
  "allocator",
  "reviewer",
  "coordinator",
];

export default function AgentsPage() {
  const [domains, setDomains] = useState<ErpDomain[]>([]);
  const [agents, setAgents] = useState<AgentRole[]>([]);
  const [domainId, setDomainId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<AgentRoleKind>("planner");
  const [specialization, setSpecialization] = useState("0.7");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const d = await api<{ items: ErpDomain[] }>(
        "/api/domains?page=1&pageSize=50",
      );
      setDomains(d.items);
      const id = domainId || d.items[0]?.id || "";
      if (!domainId && id) setDomainId(id);
      const a = await api<{ items: AgentRole[] }>(
        `/api/agents?domainId=${encodeURIComponent(id)}`,
      );
      setAgents(a.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!domainId) return;
    start(async () => {
      const a = await api<{ items: AgentRole[] }>(
        `/api/agents?domainId=${encodeURIComponent(domainId)}`,
      );
      setAgents(a.items);
    });
  }, [domainId]);

  function create() {
    start(async () => {
      try {
        await api<AgentRole>("/api/agents", {
          method: "POST",
          body: JSON.stringify({
            domainId,
            name,
            kind,
            specialization: Number(specialization),
          }),
        });
        setName("");
        setError("");
        const a = await api<{ items: AgentRole[] }>(
          `/api/agents?domainId=${encodeURIComponent(domainId)}`,
        );
        setAgents(a.items);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function toggle(agent: AgentRole) {
    start(async () => {
      await api<AgentRole>("/api/agents", {
        method: "POST",
        body: JSON.stringify({
          agentId: agent.id,
          toggleActive: !agent.active,
        }),
      });
      const a = await api<{ items: AgentRole[] }>(
        `/api/agents?domainId=${encodeURIComponent(domainId)}`,
      );
      setAgents(a.items);
    });
  }

  return (
    <StudioShell
      title="Role agents"
      subtitle="Orchestrate planner, allocator, reviewer, and coordinator agents per domain."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Add agent</p>
          <div>
            <Label htmlFor="domain">Domain</Label>
            <select
              id="domain"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="an">Name</Label>
            <Input
              id="an"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Capacity allocator"
            />
          </div>
          <div>
            <Label htmlFor="ak">Kind</Label>
            <select
              id="ak"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as AgentRoleKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="sp">Specialization</Label>
            <Input
              id="sp"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !domainId}
            onClick={create}
          >
            Add agent
          </Button>
        </div>

        <ul className="space-y-2">
          {agents.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{a.name}</p>
                  <Badge variant="secondary">{a.kind}</Badge>
                  <Badge variant={a.active ? "default" : "outline"}>
                    {a.active ? "active" : "paused"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Specialization {a.specialization.toFixed(2)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toggle(a)}>
                {a.active ? "Pause" : "Activate"}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
