"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  checkId: string;
  ruleId: string;
  crateCoverage: number;
  structuralFidelity: number;
  semanticClarity: number;
  checkStability: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [checks, setChecks] = useState<Ref[]>([]);
  const [rules, setRules] = useState<Ref[]>([]);
  const [checkId, setCheckId] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [crateCoverage, setCrateCoverage] = useState("0.62");
  const [structuralFidelity, setStructuralFidelity] = useState("0.7");
  const [semanticClarity, setSemanticClarity] = useState("0.74");
  const [checkStability, setCheckStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, cs, rs] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/checks"),
      api<{ items: Ref[] }>("/api/rules"),
    ]);
    setItems(runs.items);
    setChecks(cs.items);
    setRules(rs.items);
    if (!checkId && cs.items[0]) setCheckId(cs.items[0].id);
    if (!ruleId && rs.items[0]) setRuleId(rs.items[0].id);
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
          checkId,
          ruleId,
          crateCoverage: Number(crateCoverage),
          structuralFidelity: Number(structuralFidelity),
          semanticClarity: Number(semanticClarity),
          checkStability: Number(checkStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Validation runs"
      subtitle="Soft-sim runs that feed ARC vs metadata-only compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="check">Check</Label>
          <select
            id="check"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={checkId}
            onChange={(e) => setCheckId(e.target.value)}
          >
            {checks.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="rule">Validation rule</Label>
          <select
            id="rule"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
          >
            {rules.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Crate coverage</Label>
          <Input
            id="cov"
            value={crateCoverage}
            onChange={(e) => setCrateCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Structural fidelity</Label>
          <Input
            id="fid"
            value={structuralFidelity}
            onChange={(e) => setStructuralFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clar">Semantic clarity</Label>
          <Input
            id="clar"
            value={semanticClarity}
            onChange={(e) => setSemanticClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stab">Check stability</Label>
          <Input
            id="stab"
            value={checkStability}
            onChange={(e) => setCheckStability(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              cov {r.crateCoverage} · struct {r.structuralFidelity} · sem{" "}
              {r.semanticClarity} · stab {r.checkStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
