"use client";

import { FormEvent, useEffect, useState } from "react";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { EmpiricalClaim } from "@/store";

export default function ClaimsPage() {
  const [items, setItems] = useState<EmpiricalClaim[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("macro");
  const [statement, setStatement] = useState("");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: EmpiricalClaim[] }>(
      `/api/claims?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/claims", {
        method: "POST",
        body: JSON.stringify({
          title,
          domain,
          statement,
          status: "open",
          notes: "Captured from claims page",
        }),
      });
      setTitle("");
      setStatement("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Claims"
      subtitle="Register empirical claims before tool attestations and proof chains attach."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: scores are soft-sim fixtures — not Lean 4 production
            certs. Guide:{" "}
            <a
              className="text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
              href={GUIDE_PATH}
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Claim title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Input
          className="md:col-span-2"
          placeholder="Statement"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
        />
        <Button type="submit">Add claim</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search claims"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No claims yet — create one to unlock attestations, proofs, and ledger
          entries.
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {c.title}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {c.status} · {c.domain}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{c.statement || "—"}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
