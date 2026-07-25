"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Case = { id: string; label: string };
type Tax = {
  id: string;
  caseId: string;
  gateType: string;
  severityBand: string;
  boundaryCode: string;
  status: string;
};

const GATE_TYPES = [
  "refusal",
  "scope",
  "harm",
  "dosage",
  "disclaimer",
  "hallucination",
] as const;
const BANDS = ["low", "moderate", "high", "critical"] as const;

export default function GatesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [items, setItems] = useState<Tax[]>([]);
  const [caseId, setCaseId] = useState("");
  const [gateType, setGateType] = useState<string>("harm");
  const [severityBand, setSeverityBand] = useState<string>("high");
  const [boundaryCode, setBoundaryCode] = useState("BND-SCOPE-01");
  const [error, setError] = useState("");

  async function load() {
    const caseData = await api<{ items: Case[] }>("/api/cases");
    setCases(caseData.items);
    if (!caseId && caseData.items[0]) setCaseId(caseData.items[0].id);
    const tax = await api<{ items: Tax[] }>("/api/gates");
    setItems(tax.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const res = await api<{ taxonomy: Tax | null }>("/api/gates", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          gateType,
          severityBand,
          boundaryCode,
        }),
      });
      if (!res.taxonomy) {
        setError("Need a fail case first.");
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Gate taxonomy"
      subtitle="Severity bands and safety-gate types tied to each fail case."
    >
      {cases.length === 0 ? (
        <p className="text-sm text-slate-500">
          Need a fail case first — create one on Cases.
        </p>
      ) : (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
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
            <Label htmlFor="gt">Gate type</Label>
            <select
              id="gt"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={gateType}
              onChange={(e) => setGateType(e.target.value)}
            >
              {GATE_TYPES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="band">Severity band</Label>
            <select
              id="band"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={severityBand}
              onChange={(e) => setSeverityBand(e.target.value)}
            >
              {BANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="code">Boundary code</Label>
            <Input
              id="code"
              value={boundaryCode}
              onChange={(e) => setBoundaryCode(e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <Button className="bg-[var(--studio-signal)]" onClick={create}>
              Create taxonomy
            </Button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((t) => (
          <li
            key={t.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <span className="font-medium">{t.gateType}</span> · {t.severityBand} ·{" "}
            {t.boundaryCode} · {t.status}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
