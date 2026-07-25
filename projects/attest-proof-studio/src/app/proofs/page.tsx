"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { EmpiricalClaim, ProofChain } from "@/store";

export default function ProofsPage() {
  const [items, setItems] = useState<ProofChain[]>([]);
  const [claims, setClaims] = useState<EmpiricalClaim[]>([]);
  const [claimId, setClaimId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, c] = await Promise.all([
      api<{ items: ProofChain[] }>("/api/proofs"),
      api<{ items: EmpiricalClaim[] }>("/api/claims"),
    ]);
    setItems(p.items);
    setClaims(c.items);
    if (!claimId && c.items[0]) setClaimId(c.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/proofs", {
        method: "POST",
        body: JSON.stringify({
          claimId,
          name,
          status: "draft",
          integrity: 0.72,
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function advance(id: string) {
    setError("");
    try {
      await api("/api/proofs", {
        method: "POST",
        body: JSON.stringify({ action: "advance", id }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Proof chains"
      subtitle="Soft-sim kernel proof chains — seal when steps check out."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          required
        >
          {claims.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <Input
          placeholder="Proof name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit">Create proof</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {p.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {p.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              integrity {p.integrity} · steps {p.stepCount} · current{" "}
              {p.currentStep}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              onClick={() => advance(p.id)}
            >
              Advance status
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
