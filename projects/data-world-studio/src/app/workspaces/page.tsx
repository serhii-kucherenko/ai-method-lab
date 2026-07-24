"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Workspace, WorkspaceTier } from "@/store";

const TIERS: WorkspaceTier[] = ["sandbox", "team", "production"];

export default function WorkspacesPage() {
  const [items, setItems] = useState<Workspace[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [tier, setTier] = useState<WorkspaceTier>("team");
  const [datasetCount, setDatasetCount] = useState("3");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: Workspace[] }>(
        `/api/workspaces?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
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
        await api<Workspace>("/api/workspaces", {
          method: "POST",
          body: JSON.stringify({
            name,
            code,
            tier,
            datasetCount: Number(datasetCount),
            notes,
          }),
        });
        setName("");
        setCode("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Workspaces"
      subtitle="Register data science workspaces with tier and dataset counts before forecasting ops."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Create a workspace with code and tier.</li>
          <li>Catalog operations with cost signals, then forecast outcomes.</li>
          <li>Configure agents, run rollouts, compare trial-and-error.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Register workspace</p>
          <div>
            <Label htmlFor="w-name">Name</Label>
            <Input
              id="w-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Churn Lab Alpha"
            />
          </div>
          <div>
            <Label htmlFor="w-code">Code</Label>
            <Input
              id="w-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="CLA-01"
            />
          </div>
          <div>
            <Label htmlFor="w-tier">Tier</Label>
            <select
              id="w-tier"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={tier}
              onChange={(e) => setTier(e.target.value as WorkspaceTier)}
            >
              {TIERS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="w-ds">Dataset count</Label>
            <Input
              id="w-ds"
              value={datasetCount}
              onChange={(e) => setDatasetCount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="w-notes">Notes</Label>
            <Input
              id="w-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !code.trim()}
            onClick={create}
          >
            Register workspace
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search code / tier"
            />
            <Button variant="outline" onClick={() => load(q)}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((w) => (
              <li
                key={w.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{w.name}</p>
                  <Badge variant="secondary">{w.code}</Badge>
                  <Badge>{w.tier}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {w.datasetCount} datasets · {w.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
