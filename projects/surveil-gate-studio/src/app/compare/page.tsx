"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Result = {
  trust: { overall: number };
  explain: { overall: number };
  winner: string;
  gap: number;
};

export function ComparePage() {
  const [signals, setSignals] = useState<Ref[]>([]);
  const [pillars, setPillars] = useState<Ref[]>([]);
  const [policies, setPolicies] = useState<Ref[]>([]);
  const [audits, setAudits] = useState<Ref[]>([]);
  const [name, setName] = useState("Surveil gate A/B");
  const [signalId, setSignal] = useState("");
  const [pillarId, setPillar] = useState("");
  const [policyId, setPolicy] = useState("");
  const [auditId, setAudit] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [s, p, pol, a] = await Promise.all([
          api<{ items: Ref[] }>("/api/signals"),
          api<{ items: Ref[] }>("/api/pillars"),
          api<{ items: Ref[] }>("/api/policies"),
          api<{ items: Ref[] }>("/api/audit-runs"),
        ]);
        setSignals(s.items);
        setPillars(p.items);
        setPolicies(pol.items);
        setAudits(a.items);
        setSignal(s.items[0]?.id || "");
        setPillar(p.items[0]?.id || "");
        setPolicy(pol.items[0]?.id || "");
        setAudit(a.items[0]?.id || "");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not load comparison references",
        );
      }
    })();
  }, []);

  const compare = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setResult(
        (
          await api<{ compare: Result }>("/api/compare", {
            method: "POST",
            body: JSON.stringify({
              name,
              signalId,
              pillarId,
              policyId,
              auditId,
            }),
          })
        ).compare,
      );
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not run comparison");
    }
  };

  const select = (
    value: string,
    set: (v: string) => void,
    items: Ref[],
  ) => (
    <select
      className="w-full rounded-md border p-2"
      value={value}
      onChange={(e) => set(e.target.value)}
    >
      {items.map((x) => (
        <option key={x.id} value={x.id}>
          {x.label || x.id.slice(0, 8)}
        </option>
      ))}
    </select>
  );

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Compare six-pillar trust governance with an explainability-only baseline."
    >
      <form
        onSubmit={compare}
        className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2"
      >
        <div>
          <Label htmlFor="name">Comparison name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Signal batch</Label>
          {select(signalId, setSignal, signals)}
        </div>
        <div>
          <Label>Pillar</Label>
          {select(pillarId, setPillar, pillars)}
        </div>
        <div>
          <Label>Policy</Label>
          {select(policyId, setPolicy, policies)}
        </div>
        <div>
          <Label>Audit run</Label>
          {select(auditId, setAudit, audits)}
        </div>
        <Button className="w-fit">Run A/B compare</Button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {result ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border bg-white p-5">
            <p className="text-sm">Trust six-pillar overall</p>
            <strong className="text-3xl">{result.trust.overall}</strong>
          </article>
          <article className="rounded-lg border bg-white p-5">
            <p className="text-sm">Explainability-only overall</p>
            <strong className="text-3xl">{result.explain.overall}</strong>
          </article>
          <article className="rounded-lg border border-[var(--sg-amber)] bg-[var(--studio-warn-soft)] p-5">
            <p className="text-sm">Winner · gap</p>
            <strong className="text-xl">
              {result.winner} · {result.gap}
            </strong>
          </article>
        </section>
      ) : null}
    </StudioShell>
  );
}

export default ComparePage;
