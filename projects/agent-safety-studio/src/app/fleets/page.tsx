"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { AgentFleet, FleetKind } from "@/store";

const KINDS: FleetKind[] = ["iac", "coding", "ops", "security", "multi-agent"];

export default function FleetsPage() {
  const [items, setItems] = useState<AgentFleet[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<FleetKind>("iac");
  const [agentCount, setAgentCount] = useState("8");
  const [riskPressure, setRiskPressure] = useState("0.6");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: AgentFleet[] }>(
        `/api/fleets?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<AgentFleet>("/api/fleets", {
          method: "POST",
          body: JSON.stringify({
            name,
            kind,
            agentCount: Number(agentCount),
            riskPressure: Number(riskPressure),
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
      title="Agent fleets"
      subtitle="Deployment fleets with risk pressure — IaC, coding, ops, and multi-agent groups."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-stone-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-500">
          <li>Create a fleet with risk pressure.</li>
          <li>Attach structural monitors, then open Alerts for regressions.</li>
          <li>Compare structural vs threshold, then export from Runs.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Create fleet</p>
          <div>
            <Label htmlFor="f-name">Name</Label>
            <Input
              id="f-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Staging IaC agents"
            />
          </div>
          <div>
            <Label htmlFor="f-kind">Kind</Label>
            <select
              id="f-kind"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as FleetKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="f-count">Agent count</Label>
              <Input
                id="f-count"
                value={agentCount}
                onChange={(e) => setAgentCount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="f-risk">Risk pressure</Label>
              <Input
                id="f-risk"
                value={riskPressure}
                onChange={(e) => setRiskPressure(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="f-notes">Notes</Label>
            <Input
              id="f-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim()} onClick={create}>
            Create fleet
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search kind / notes"
            />
            <Button variant="outline" onClick={() => load(q)}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((f) => (
              <li
                key={f.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{f.name}</p>
                  <Badge variant="secondary">{f.kind}</Badge>
                  <Badge variant="outline">{f.agentCount} agents</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  Risk {f.riskPressure} · {f.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
