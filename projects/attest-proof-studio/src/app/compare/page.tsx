"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AttestCompare, EmpiricalClaim, ProofChain } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<AttestCompare[]>([]);
  const [claims, setClaims] = useState<EmpiricalClaim[]>([]);
  const [proofs, setProofs] = useState<ProofChain[]>([]);
  const [claimId, setClaimId] = useState("");
  const [proofId, setProofId] = useState("");
  const [name, setName] = useState("Attested vs fluent");
  const [error, setError] = useState("");

  async function load() {
    const [cmp, c, p] = await Promise.all([
      api<{ items: AttestCompare[] }>("/api/compare"),
      api<{ items: EmpiricalClaim[] }>("/api/claims"),
      api<{ items: ProofChain[] }>("/api/proofs"),
    ]);
    setItems(cmp.items);
    setClaims(c.items);
    setProofs(p.items);
    if (!claimId && c.items[0]) setClaimId(c.items[0].id);
    if (!proofId && p.items[0]) setProofId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, claimId, proofId }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Attested vs fluent"
      subtitle="Dual score panel — tool-attested proof quality vs fluent-only baseline."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
        >
          {claims.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={proofId}
          onChange={(e) => setProofId(e.target.value)}
        >
          {proofs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button type="submit">Run compare</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-[var(--studio-teal-deep)]">
                winner: {c.winner} · gap {c.gap}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  A · tool-attested {c.attested.overall}
                </p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="score-bar h-full bg-[var(--studio-teal)]"
                    style={{ width: `${Math.min(100, c.attested.overall)}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">
                  B · fluent-only {c.fluent.overall}
                </p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="score-bar h-full bg-[var(--studio-gold)]"
                    style={{ width: `${Math.min(100, c.fluent.overall)}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
