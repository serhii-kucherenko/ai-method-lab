"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { KernelStep, ProofChain } from "@/store";

export default function KernelPage() {
  const [proofs, setProofs] = useState<ProofChain[]>([]);
  const [steps, setSteps] = useState<KernelStep[]>([]);
  const [proofId, setProofId] = useState("");
  const [ruleLabel, setRuleLabel] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [error, setError] = useState("");

  async function load(pid?: string) {
    const p = await api<{ items: ProofChain[] }>("/api/proofs");
    setProofs(p.items);
    const id = pid || proofId || p.items[0]?.id || "";
    if (!proofId && id) setProofId(id);
    if (id) {
      const s = await api<{ items: KernelStep[] }>(
        `/api/kernel?proofId=${encodeURIComponent(id)}`,
      );
      setSteps(s.items);
    }
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/kernel", {
        method: "POST",
        body: JSON.stringify({
          proofId,
          ruleLabel,
          conclusion,
          softSimOk: false,
        }),
      });
      setRuleLabel("");
      setConclusion("");
      await load(proofId);
    } catch (err) {
      setError(String(err));
    }
  }

  async function mark(id: string, softSimOk: boolean) {
    try {
      await api("/api/kernel", {
        method: "POST",
        body: JSON.stringify({ action: "mark", id, softSimOk }),
      });
      await load(proofId);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Kernel walker"
      subtitle="Walk soft-sim kernel steps — mark each check before seal."
    >
      <div className="mb-4">
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={proofId}
          onChange={(e) => {
            setProofId(e.target.value);
            load(e.target.value).catch((err) => setError(String(err)));
          }}
        >
          {proofs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Rule label"
          value={ruleLabel}
          onChange={(e) => setRuleLabel(e.target.value)}
          required
        />
        <Input
          placeholder="Conclusion"
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
        />
        <Button type="submit">Add step</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ol className="space-y-3">
        {steps.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                #{s.ordinal} {s.ruleLabel}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {s.softSimOk ? "ok" : "pending"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{s.conclusion || "—"}</p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => mark(s.id, true)}
              >
                Mark OK
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => mark(s.id, false)}
              >
                Clear
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}
