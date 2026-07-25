"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { EmpiricalClaim, EvidenceEntry } from "@/store";

export default function LedgerPage() {
  const [items, setItems] = useState<EvidenceEntry[]>([]);
  const [claims, setClaims] = useState<EmpiricalClaim[]>([]);
  const [claimId, setClaimId] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [citationText, setCitationText] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load(search = q) {
    const [l, c] = await Promise.all([
      api<{ items: EvidenceEntry[] }>(
        `/api/ledger?q=${encodeURIComponent(search)}`,
      ),
      api<{ items: EmpiricalClaim[] }>("/api/claims"),
    ]);
    setItems(l.items);
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
      await api("/api/ledger", {
        method: "POST",
        body: JSON.stringify({
          claimId,
          sourceLabel,
          citationText,
          groundingScore: 0.75,
        }),
      });
      setSourceLabel("");
      setCitationText("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Evidence ledger"
      subtitle="Ground claims with cited sources and grounding scores."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
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
          placeholder="Source label"
          value={sourceLabel}
          onChange={(e) => setSourceLabel(e.target.value)}
          required
        />
        <Input
          className="md:col-span-2"
          placeholder="Citation text"
          value={citationText}
          onChange={(e) => setCitationText(e.target.value)}
        />
        <Button type="submit">Add evidence</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter ledger"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((e) => (
          <li
            key={e.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {e.sourceLabel}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                ground {e.groundingScore}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {e.citationText || "—"}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
