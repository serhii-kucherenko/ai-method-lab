"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type AuditRun = {
  id: string;
  signalId: string;
  pillarId: string;
  policyId: string;
  pillarCoverage: number;
  policyCompleteness: number;
  signalIntegrity: number;
  packReadiness: number;
  status: string;
};

export function AuditsPage() {
  const [signals, setSignals] = useState<Ref[]>([]);
  const [pillars, setPillars] = useState<Ref[]>([]);
  const [policies, setPolicies] = useState<Ref[]>([]);
  const [items, setItems] = useState<AuditRun[]>([]);
  const [signalId, setSignal] = useState("");
  const [pillarId, setPillar] = useState("");
  const [policyId, setPolicy] = useState("");
  const [pillarCoverage, setPillarCov] = useState(0.65);
  const [policyCompleteness, setPolicyComp] = useState(0.7);
  const [signalIntegrity, setIntegrity] = useState(0.72);
  const [packReadiness, setReady] = useState(0.68);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s, p, pol, a] = await Promise.all([
        api<{ items: Ref[] }>("/api/signals"),
        api<{ items: Ref[] }>("/api/pillars"),
        api<{ items: Ref[] }>("/api/policies"),
        api<{ items: AuditRun[] }>("/api/audit-runs"),
      ]);
      setSignals(s.items);
      setPillars(p.items);
      setPolicies(pol.items);
      setItems(a.items);
      setSignal(s.items[0]?.id || "");
      setPillar(p.items[0]?.id || "");
      setPolicy(pol.items[0]?.id || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load audits");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/audit-runs", {
        method: "POST",
        body: JSON.stringify({
          signalId,
          pillarId,
          policyId,
          pillarCoverage,
          policyCompleteness,
          signalIntegrity,
          packReadiness,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create audit");
    }
  };

  return (
    <StudioShell
      title="Audit runs"
      subtitle="Soft-sim governance audit runs with pillar, policy, and signal proxies."
    >
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Signal batch</Label>
          <select
            className="w-full rounded-md border p-2"
            value={signalId}
            onChange={(e) => setSignal(e.target.value)}
          >
            {signals.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label || x.id.slice(0, 8)}
              </option>
            ))}
          </select>
          <Label>Pillar</Label>
          <select
            className="w-full rounded-md border p-2"
            value={pillarId}
            onChange={(e) => setPillar(e.target.value)}
          >
            {pillars.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label || x.id.slice(0, 8)}
              </option>
            ))}
          </select>
          <Label>Policy</Label>
          <select
            className="w-full rounded-md border p-2"
            value={policyId}
            onChange={(e) => setPolicy(e.target.value)}
          >
            {policies.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label || x.id.slice(0, 8)}
              </option>
            ))}
          </select>
          <Label htmlFor="pc">Pillar coverage</Label>
          <Input
            id="pc"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={pillarCoverage}
            onChange={(e) => setPillarCov(Number(e.target.value))}
          />
          <Label htmlFor="pol">Policy completeness</Label>
          <Input
            id="pol"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={policyCompleteness}
            onChange={(e) => setPolicyComp(Number(e.target.value))}
          />
          <Label htmlFor="si">Signal integrity</Label>
          <Input
            id="si"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={signalIntegrity}
            onChange={(e) => setIntegrity(Number(e.target.value))}
          />
          <Label htmlFor="pr">Pack readiness</Label>
          <Input
            id="pr"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={packReadiness}
            onChange={(e) => setReady(Number(e.target.value))}
          />
          <Button>Create audit run</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article
                key={row.id}
                className="row-lift rounded-lg border bg-white p-4"
              >
                <h2 className="font-semibold">{row.id.slice(0, 8)}</h2>
                <p className="text-sm text-slate-600">
                  pillar {row.pillarCoverage} · policy {row.policyCompleteness} ·
                  signal {row.signalIntegrity} · ready {row.packReadiness} ·{" "}
                  {row.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default AuditsPage;
