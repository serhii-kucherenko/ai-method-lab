"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  AgentFleet,
  CheckKind,
  DeployMode,
  SafetyMonitor,
} from "@/store";

const CHECKS: CheckKind[] = [
  "cfg",
  "dfg",
  "privilege",
  "logging",
  "deny-guard",
  "sink",
  "hardening",
];

export default function MonitorsPage() {
  const [fleets, setFleets] = useState<AgentFleet[]>([]);
  const [items, setItems] = useState<SafetyMonitor[]>([]);
  const [fleetId, setFleetId] = useState("");
  const [name, setName] = useState("");
  const [checkKind, setCheckKind] = useState<CheckKind>("cfg");
  const [coverage, setCoverage] = useState("0.75");
  const [deployMode, setDeployMode] = useState<DeployMode>("sync");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(fid = fleetId) {
    start(async () => {
      const f = await api<{ items: AgentFleet[] }>(
        "/api/fleets?page=1&pageSize=50",
      );
      setFleets(f.items);
      const nextFleet = fid || f.items[0]?.id || "";
      if (!fleetId && nextFleet) setFleetId(nextFleet);
      const m = await api<{ items: SafetyMonitor[] }>(
        `/api/monitors?fleetId=${encodeURIComponent(nextFleet || fid)}`,
      );
      setItems(m.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<SafetyMonitor>("/api/monitors", {
          method: "POST",
          body: JSON.stringify({
            fleetId,
            name,
            checkKind,
            coverage: Number(coverage),
            deployMode,
          }),
        });
        setName("");
        setError("");
        load(fleetId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function toggle(id: string, active: boolean) {
    start(async () => {
      await api<SafetyMonitor>("/api/monitors", {
        method: "POST",
        body: JSON.stringify({ id, toggle: !active }),
      });
      load(fleetId);
    });
  }

  return (
    <StudioShell
      title="Structural monitors"
      subtitle="CFG, DFG, privilege, and deny-guard checks in sync or async deploy mode."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Add monitor</p>
          <div>
            <Label htmlFor="m-fleet">Fleet</Label>
            <select
              id="m-fleet"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={fleetId}
              onChange={(e) => {
                setFleetId(e.target.value);
                load(e.target.value);
              }}
            >
              {fleets.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="m-name">Name</Label>
            <Input
              id="m-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Privilege broaden scan"
            />
          </div>
          <div>
            <Label htmlFor="m-kind">Check kind</Label>
            <select
              id="m-kind"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={checkKind}
              onChange={(e) => setCheckKind(e.target.value as CheckKind)}
            >
              {CHECKS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="m-cov">Coverage</Label>
              <Input
                id="m-cov"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="m-mode">Deploy mode</Label>
              <select
                id="m-mode"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={deployMode}
                onChange={(e) => setDeployMode(e.target.value as DeployMode)}
              >
                <option value="sync">sync</option>
                <option value="async">async</option>
              </select>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !fleetId} onClick={create}>
            Add monitor
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{m.name}</p>
                  <Badge variant="secondary">{m.checkKind}</Badge>
                  <Badge variant="outline">{m.deployMode}</Badge>
                  {m.active ? (
                    <Badge>active</Badge>
                  ) : (
                    <Badge variant="outline">off</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  Coverage {m.coverage}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggle(m.id, m.active)}
              >
                {m.active ? "Disable" : "Enable"}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
