"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type WorkflowRow = {
  id: string;
  packId?: string;
  label: string;
  workflowSummary: string;
  successCondition: string;
  researchChannel: string;
  status: string;
};

export default function WorkflowsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<WorkflowRow[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Governed end-to-end research workflow");
  const [workflowSummary, setWorkflowSummary] = useState(
    "Soft-sim governed research stages vs ungated agent baseline.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [researchChannel, setResearchChannel] = useState("soft_sim_research");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, l] = await Promise.all([
      api<{ items: Pack[] }>("/api/studies"),
      api<{ items: WorkflowRow[] }>(
        `/api/workflows?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(l.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/workflows", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          workflowSummary,
          successCondition,
          researchChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Research workflows"
      subtitle="Workflow configs that stay inside governance gates before a pack lock."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search workflows"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Study pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
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
          <Label htmlFor="label">Workflow name</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Workflow summary</Label>
          <Input
            id="summary"
            value={workflowSummary}
            onChange={(e) => setWorkflowSummary(e.target.value)}
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
          <Label htmlFor="channel">Research channel</Label>
          <Input
            id="channel"
            value={researchChannel}
            onChange={(e) => setResearchChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create workflow</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{row.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {row.workflowSummary}
            </div>
            <div className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
              {row.successCondition} · {row.researchChannel} · {row.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
