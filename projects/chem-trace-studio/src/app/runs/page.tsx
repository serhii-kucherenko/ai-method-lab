"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  recoveryId: string;
  ruleId: string;
  packCoverage: number;
  ruleFidelity: number;
  recoveryClarity: number;
  runStability: number;
  status: string;
};

type Ref = { id: string; label: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [recoveries, setRecoveries] = useState<Ref[]>([]);
  const [rules, setRules] = useState<Ref[]>([]);
  const [recoveryId, setRecoveryId] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [packCoverage, setPackCoverage] = useState("0.65");
  const [ruleFidelity, setRuleFidelity] = useState("0.7");
  const [recoveryClarity, setRecoveryClarity] = useState("0.72");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, recs, rls] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/recoveries"),
      api<{ items: Ref[] }>("/api/rules"),
    ]);
    setItems(runs.items);
    setRecoveries(recs.items);
    setRules(rls.items);
    if (!recoveryId && recs.items[0]) setRecoveryId(recs.items[0].id);
    if (!ruleId && rls.items[0]) setRuleId(rls.items[0].id);
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
          recoveryId,
          ruleId,
          packCoverage: Number(packCoverage),
          ruleFidelity: Number(ruleFidelity),
          recoveryClarity: Number(recoveryClarity),
          runStability: Number(runStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Trace runs"
      subtitle="Record soft-sim pack coverage, rule fidelity, recovery clarity, and run stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="recovery">Recovery config</Label>
          <select
            id="recovery"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={recoveryId}
            onChange={(e) => setRecoveryId(e.target.value)}
          >
            {recoveries.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="rule">Trace rule</Label>
          <select
            id="rule"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
          >
            {rules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="pc">Pack coverage</Label>
          <Input
            id="pc"
            value={packCoverage}
            onChange={(e) => setPackCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rf">Rule fidelity</Label>
          <Input
            id="rf"
            value={ruleFidelity}
            onChange={(e) => setRuleFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rc">Recovery clarity</Label>
          <Input
            id="rc"
            value={recoveryClarity}
            onChange={(e) => setRecoveryClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rs">Run stability</Label>
          <Input
            id="rs"
            value={runStability}
            onChange={(e) => setRunStability(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create trace run</Button>
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
              P {r.packCoverage.toFixed(2)} · R {r.ruleFidelity.toFixed(2)} · C{" "}
              {r.recoveryClarity.toFixed(2)} · S {r.runStability.toFixed(2)} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
