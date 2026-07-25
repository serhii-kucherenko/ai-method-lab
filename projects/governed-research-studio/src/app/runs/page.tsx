"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Run = {
  id: string;
  workflowId: string;
  gateId: string;
  gateCoverage: number;
  workflowIntegrity: number;
  evidenceProvenance: number;
  privacyControl: number;
  status: string;
};

export default function RunsPage() {
  const [workflows, setWorkflows] = useState<Ref[]>([]);
  const [gates, setGates] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [workflowId, setWorkflowId] = useState("");
  const [gateId, setGateId] = useState("");
  const [gateCoverage, setGateCoverage] = useState("0.6");
  const [workflowIntegrity, setWorkflowIntegrity] = useState("0.7");
  const [evidenceProvenance, setEvidenceProvenance] = useState("0.72");
  const [privacyControl, setPrivacyControl] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [p, w, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/workflows"),
      api<{ items: Ref[] }>("/api/gates"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setWorkflows(p.items);
    setGates(w.items);
    setItems(r.items);
    if (!workflowId && p.items[0]) setWorkflowId(p.items[0].id);
    if (!gateId && w.items[0]) setGateId(w.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          workflowId,
          gateId,
          gateCoverage: Number(gateCoverage),
          workflowIntegrity: Number(workflowIntegrity),
          evidenceProvenance: Number(evidenceProvenance),
          privacyControl: Number(privacyControl),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Research runs"
      subtitle="Soft-sim research runs that feed dual A/B compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="workflow">Workflow</Label>
          <select
            id="workflow"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={workflowId}
            onChange={(e) => setWorkflowId(e.target.value)}
          >
            {workflows.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gate">Governance gate</Label>
          <select
            id="gate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
          >
            {gates.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="coverage">Gate coverage</Label>
          <Input
            id="coverage"
            value={gateCoverage}
            onChange={(e) => setGateCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="integrity">Workflow integrity</Label>
          <Input
            id="integrity"
            value={workflowIntegrity}
            onChange={(e) => setWorkflowIntegrity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="evidence">Evidence provenance</Label>
          <Input
            id="evidence"
            value={evidenceProvenance}
            onChange={(e) => setEvidenceProvenance(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="privacy">Privacy control</Label>
          <Input
            id="privacy"
            value={privacyControl}
            onChange={(e) => setPrivacyControl(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              gate {r.gateCoverage} · workflow {r.workflowIntegrity} · evidence{" "}
              {r.evidenceProvenance} · privacy {r.privacyControl} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
