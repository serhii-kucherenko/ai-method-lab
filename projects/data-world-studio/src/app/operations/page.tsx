"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DataOperation, OpKind, Workspace } from "@/store";

const KINDS: OpKind[] = [
  "feature-build",
  "model-fit",
  "eval-run",
  "data-clean",
  "export-pack",
  "hyper-search",
];

export default function OperationsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [items, setItems] = useState<DataOperation[]>([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<OpKind>("model-fit");
  const [estimatedCost, setEstimatedCost] = useState("40");
  const [complexity, setComplexity] = useState("0.6");
  const [notes, setNotes] = useState("");
  const [q, setQ] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function loadOps() {
    start(async () => {
      const params = new URLSearchParams({ page: "1", pageSize: "30" });
      if (q) params.set("q", q);
      if (maxCost) params.set("maxCost", maxCost);
      const res = await api<{ items: DataOperation[] }>(
        `/api/operations?${params}`,
      );
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
      const ops = await api<{ items: DataOperation[] }>(
        "/api/operations?page=1&pageSize=30",
      );
      setItems(ops.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<DataOperation>("/api/operations", {
          method: "POST",
          body: JSON.stringify({
            workspaceId,
            name,
            kind,
            estimatedCost: Number(estimatedCost),
            complexity: Number(complexity),
            notes,
          }),
        });
        setName("");
        setError("");
        loadOps();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Operations"
      subtitle="Catalog DS operations with estimated cost and complexity before you forecast."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Add operation</p>
          <div>
            <Label htmlFor="o-ws">Workspace</Label>
            <select
              id="o-ws"
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
            <Label htmlFor="o-name">Name</Label>
            <Input
              id="o-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Feature build + model fit"
            />
          </div>
          <div>
            <Label htmlFor="o-kind">Kind</Label>
            <select
              id="o-kind"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as OpKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="o-cost">Estimated cost</Label>
            <Input
              id="o-cost"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="o-cx">Complexity (0–1)</Label>
            <Input
              id="o-cx"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="o-notes">Notes</Label>
            <Input
              id="o-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !workspaceId}
            onClick={create}
          >
            Add operation
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name / kind"
              className="min-w-[10rem] flex-1"
            />
            <Input
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              placeholder="Max cost"
              className="w-28"
            />
            <Button variant="outline" onClick={loadOps}>
              Filter
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((o) => (
              <li
                key={o.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{o.name}</p>
                  <Badge variant="secondary">{o.kind}</Badge>
                  <Badge>cost {o.estimatedCost}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Complexity {o.complexity} · {o.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
