"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { EmpiricalClaim, ToolAttestation } from "@/store";

export default function AttestationsPage() {
  const [items, setItems] = useState<ToolAttestation[]>([]);
  const [claims, setClaims] = useState<EmpiricalClaim[]>([]);
  const [claimId, setClaimId] = useState("");
  const [toolName, setToolName] = useState("");
  const [toolKind, setToolKind] = useState("calc");
  const [error, setError] = useState("");

  async function load() {
    const [a, c] = await Promise.all([
      api<{ items: ToolAttestation[] }>("/api/attestations"),
      api<{ items: EmpiricalClaim[] }>("/api/claims"),
    ]);
    setItems(a.items);
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
      await api("/api/attestations", {
        method: "POST",
        body: JSON.stringify({
          claimId,
          toolName,
          toolKind,
          status: "bound",
          coverage: 0.75,
          freshness: 0.8,
        }),
      });
      setToolName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Tool attestations"
      subtitle="Bind calc, search, code, or retrieval tools to empirical claims."
    >
      {claims.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          Create a claim first, then attach attestations.
        </p>
      ) : null}

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
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
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={toolKind}
          onChange={(e) => setToolKind(e.target.value)}
        >
          <option value="calc">calc</option>
          <option value="search">search</option>
          <option value="code">code</option>
          <option value="retrieval">retrieval</option>
        </select>
        <Input
          placeholder="Tool name"
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          required
        />
        <Button type="submit">Add attestation</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {a.toolName}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {a.toolKind} · {a.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              coverage {a.coverage} · freshness {a.freshness} · {a.payloadDigest}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
