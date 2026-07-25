"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Plan = { id: string; label: string };
type Contact = { id: string; label: string };
type Run = { id: string; planId: string; contactId: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  contactCentric: { overall: number };
  visionOnly: { overall: number };
};

export default function ComparePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [planId, setPlanId] = useState("");
  const [contactId, setContactId] = useState("");
  const [sensingRunId, setSensingRunId] = useState("");
  const [name, setName] = useState("Contact-centric vs vision-only");
  const [last, setLast] = useState<Compare | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [c, m, r, cmp] = await Promise.all([
      api<{ items: Plan[] }>("/api/plans"),
      api<{ items: Contact[] }>("/api/contacts"),
      api<{ items: Run[] }>("/api/sensing"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setPlans(c.items);
    setContacts(m.items);
    setRuns(r.items);
    setCompares(cmp.items);
    if (!planId && c.items[0]) setPlanId(c.items[0].id);
    if (!contactId && m.items[0]) setContactId(m.items[0].id);
    if (!sensingRunId && r.items[0]) setSensingRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      const data = await api<{ compare: Compare }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          planId, contactId, sensingRunId, bias: "balanced",
        }),
      });
      setLast(data.compare);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Contact-centric tactile+vision scorer (A) vs vision-only baseline (B)."
    >
      {!runs.length ? (
        <p className="mb-6 text-slate-500">
          Need a sensing run — create one on /sensing first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="case">Contact plan</Label>
          <select
            id="case"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
          >
            {plans.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="mask">Contact definition</Label>
          <select
            id="mask"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          >
            {contacts.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Sensing run</Label>
          <select
            id="run"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={sensingRunId}
            onChange={(e) => setSensingRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {last ? (
        <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <div className="font-medium text-slate-900">Latest delta</div>
          <p className="mt-2 text-sm text-slate-600">
            Contact-centric {last.contactCentric.overall} vs vision-only{" "}
            {last.visionOnly.overall} · winner {last.winner} · gap {last.gap}
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">Contact-centric</div>
              <div
                className="score-bar mt-1 h-2 rounded bg-[var(--studio-orange)]"
                style={{ width: `${last.contactCentric.overall}%` }}
              />
            </div>
            <div>
              <div className="text-xs text-slate-500">Vision-only baseline</div>
              <div
                className="score-bar mt-1 h-2 rounded bg-[var(--studio-warn)]"
                style={{ width: `${last.visionOnly.overall}%` }}
              />
            </div>
          </div>
        </div>
      ) : null}
      {compares.length === 0 ? (
        <p className="text-slate-500">No compares yet.</p>
      ) : (
        <ul className="space-y-2">
          {compares.map((c) => (
            <li
              key={c.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-1 text-sm text-slate-500">
                Contact-centric {c.contactCentric.overall} · vision-only{" "}
                {c.visionOnly.overall} · {c.winner} · gap {c.gap}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
