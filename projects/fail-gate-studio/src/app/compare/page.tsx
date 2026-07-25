"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Case = { id: string; label: string };
type Tax = { id: string; gateType: string };
type Insp = { id: string; boundaryFit: number };
type Quality = {
  overall: number;
  severityDiagnosis: number;
  gateTypeDiagnosis: number;
  boundaryReasonScore: number;
  taxonomyIntegrity: number;
  correctnessScore: number;
};
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  failGate: Quality;
  correctnessOnly: Quality;
};

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded bg-slate-200">
        <div
          className="score-bar h-2 rounded bg-[var(--studio-signal)]"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [inspections, setInspections] = useState<Insp[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [caseId, setCaseId] = useState("");
  const [taxonomyId, setTaxonomyId] = useState("");
  const [inspectionId, setInspectionId] = useState("");
  const [name, setName] = useState("Release gate A/B");
  const [latest, setLatest] = useState<Compare | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const caseData = await api<{ items: Case[] }>("/api/cases");
    setCases(caseData.items);
    const cid = caseId || caseData.items[0]?.id || "";
    if (!caseId && cid) setCaseId(cid);
    const tax = await api<{ items: Tax[] }>("/api/gates");
    setTaxes(tax.items);
    const tid = taxonomyId || tax.items[0]?.id || "";
    if (!taxonomyId && tid) setTaxonomyId(tid);
    const insp = await api<{ items: Insp[] }>("/api/boundaries");
    setInspections(insp.items);
    const iid = inspectionId || insp.items[0]?.id || "";
    if (!inspectionId && iid) setInspectionId(iid);
    const cmp = await api<{ items: Compare[] }>("/api/compare");
    setCompares(cmp.items);
    if (cmp.items[0]) setLatest(cmp.items[0]);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      const res = await api<{ compare: Compare }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, caseId, taxonomyId, inspectionId }),
      });
      setLatest(res.compare);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const ready =
    cases.length > 0 && taxes.length > 0 && inspections.length > 0;

  return (
    <StudioShell
      title="Dual compare"
      subtitle="Fail-gate taxonomy diagnosis (A) vs correctness-only baseline (B)."
    >
      {!ready ? (
        <p className="text-sm text-slate-500">
          Need case + taxonomy + boundary inspection — seed from onboarding or
          create each entity first.
        </p>
      ) : (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
          <div>
            <Label htmlFor="name">Compare name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="case">Case</Label>
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
                  {t.gateType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="insp">Inspection</Label>
            <select
              id="insp"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={inspectionId}
              onChange={(e) => setInspectionId(e.target.value)}
            >
              {inspections.map((i) => (
                <option key={i.id} value={i.id}>
                  fit {i.boundaryFit}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4">
            <Button className="bg-[var(--studio-signal)]" onClick={run}>
              Run A vs B
            </Button>
          </div>
        </div>
      )}

      {latest ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg">
              A · Fail-gate diagnosis ({latest.failGate.overall.toFixed(1)})
            </h2>
            <Bar label="Severity" value={latest.failGate.severityDiagnosis} />
            <Bar label="Gate type" value={latest.failGate.gateTypeDiagnosis} />
            <Bar
              label="Boundary reason"
              value={latest.failGate.boundaryReasonScore}
            />
            <Bar
              label="Taxonomy integrity"
              value={latest.failGate.taxonomyIntegrity}
            />
          </div>
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg">
              B · Correctness-only (
              {latest.correctnessOnly.overall.toFixed(1)})
            </h2>
            <Bar
              label="Correctness"
              value={latest.correctnessOnly.correctnessScore}
            />
            <Bar
              label="Severity (naive)"
              value={latest.correctnessOnly.severityDiagnosis}
            />
            <Bar
              label="Gate type (naive)"
              value={latest.correctnessOnly.gateTypeDiagnosis}
            />
            <Bar
              label="Boundary (naive)"
              value={latest.correctnessOnly.boundaryReasonScore}
            />
          </div>
          <p className="md:col-span-2 text-sm text-slate-600">
            Winner: <strong>{latest.winner}</strong> · gap {latest.gap}
          </p>
        </div>
      ) : null}

      <ul className="space-y-2">
        {compares.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            {c.name} · {c.winner} · gap {c.gap}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
