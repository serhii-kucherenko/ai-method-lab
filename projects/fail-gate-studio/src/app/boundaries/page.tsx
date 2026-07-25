"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Case = { id: string; label: string };
type Tax = { id: string; gateType: string; boundaryCode: string };
type Insp = {
  id: string;
  caseId: string;
  taxonomyId: string;
  boundaryFit: number;
  evidenceStrength: number;
  taxonomyCoherence: number;
  status: string;
  reviewerNotes: string;
};

export default function BoundariesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [items, setItems] = useState<Insp[]>([]);
  const [caseId, setCaseId] = useState("");
  const [taxonomyId, setTaxonomyId] = useState("");
  const [boundaryFit, setBoundaryFit] = useState(0.75);
  const [evidenceStrength, setEvidenceStrength] = useState(0.7);
  const [taxonomyCoherence, setTaxonomyCoherence] = useState(0.72);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const caseData = await api<{ items: Case[] }>("/api/cases");
    setCases(caseData.items);
    const cid = caseId || caseData.items[0]?.id || "";
    if (!caseId && cid) setCaseId(cid);
    const tax = await api<{ items: Tax[] }>(
      `/api/gates${cid ? `?caseId=${cid}` : ""}`,
    );
    setTaxes(tax.items);
    if (!taxonomyId && tax.items[0]) setTaxonomyId(tax.items[0].id);
    const insp = await api<{ items: Insp[] }>("/api/boundaries");
    setItems(insp.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const res = await api<{ inspection: Insp | null }>("/api/boundaries", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          taxonomyId,
          boundaryFit,
          evidenceStrength,
          taxonomyCoherence,
          reviewerNotes: notes,
        }),
      });
      if (!res.inspection) {
        setError("Need case + taxonomy first.");
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const ready = cases.length > 0 && taxes.length > 0;

  return (
    <StudioShell
      title="Boundary inspections"
      subtitle="Inspect boundary fit, evidence strength, and taxonomy coherence."
    >
      {!ready ? (
        <p className="text-sm text-slate-500">
          Need a fail case and gate taxonomy first.
        </p>
      ) : (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
          <div>
            <Label htmlFor="case">Fail case</Label>
            <select
              id="case"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="tax">Taxonomy</Label>
            <select
              id="tax"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={taxonomyId}
              onChange={(e) => setTaxonomyId(e.target.value)}
            >
              {taxes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.gateType} · {t.boundaryCode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="notes">Reviewer notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fit">Boundary fit</Label>
            <Input
              id="fit"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={boundaryFit}
              onChange={(e) => setBoundaryFit(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="ev">Evidence strength</Label>
            <Input
              id="ev"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={evidenceStrength}
              onChange={(e) => setEvidenceStrength(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="coh">Taxonomy coherence</Label>
            <Input
              id="coh"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={taxonomyCoherence}
              onChange={(e) => setTaxonomyCoherence(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-3">
            <Button className="bg-[var(--studio-signal)]" onClick={create}>
              Create inspection
            </Button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            fit {i.boundaryFit} · evidence {i.evidenceStrength} · coherence{" "}
            {i.taxonomyCoherence} · {i.status}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
