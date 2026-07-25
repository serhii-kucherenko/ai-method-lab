"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Plan = {
  id: string;
  label: string;
  planSummary: string;
  successCondition: string;
  workspace: string;
  status: string;
};

export default function PlansPage() {
  const [items, setItems] = useState<Plan[]>([]);
  const [label, setLabel] = useState("");
  const [planSummary, setPlanSummary] = useState("");
  const [successCondition, setSuccessCondition] = useState("stable_contact");
  const [workspace, setWorkspace] = useState("bench_top");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Plan[] }>(
      `/api/plans?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/plans", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled contact plan",
          planSummary: planSummary || "Contact plan pending",
          successCondition,
          workspace,
        }),
      });
      setLabel("");
      setPlanSummary("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Contact plans"
      subtitle="Plan intended contact and its soft-sim success condition."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search contact plans or workspaces"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="segment">Workspace</Label>
          <Input
            id="segment"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Plan summary</Label>
          <Input
            id="summary"
            value={planSummary}
            onChange={(e) => setPlanSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="outcome">Success condition</Label>
          <select
            id="outcome"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          >
            <option value="stable_contact">stable contact</option>
            <option value="gentle_contact">gentle contact</option>
            <option value="contact_avoidance">contact avoidance</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create contact plan</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No contact plans yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {c.successCondition} · {c.workspace} · {c.status}
              </div>
              <p className="mt-1 text-sm text-slate-600">{c.planSummary}</p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
