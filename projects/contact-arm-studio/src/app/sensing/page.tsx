"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Plan = { id: string; label: string };
type Contact = { id: string; label: string; contactCoverage: number };
type Run = {
  id: string;
  planId: string;
  contactId: string;
  contactCoverage: number;
  tactileConfidence: number;
  visionConfidence: number;
  cueAgreement: number;
  status: string;
};

export default function SensingPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [planId, setPlanId] = useState("");
  const [contactId, setContactId] = useState("");
  const [contactCoverage, setContactCoverage] = useState(0.42);
  const [tactileConfidence, setTactileConfidence] = useState(0.7);
  const [visionConfidence, setVisionConfidence] = useState(0.74);
  const [cueAgreement, setCueAgreement] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [runs, c, m] = await Promise.all([
      api<{ items: Run[] }>("/api/sensing"),
      api<{ items: Plan[] }>("/api/plans"),
      api<{ items: Contact[] }>("/api/contacts"),
    ]);
    setItems(runs.items);
    setPlans(c.items);
    setContacts(m.items);
    if (!planId && c.items[0]) setPlanId(c.items[0].id);
    if (!contactId && m.items[0]) {
      setContactId(m.items[0].id);
      setContactCoverage(m.items[0].contactCoverage);
    }
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!planId || !contactId) {
      setError("Need a contact plan and contact point");
      return;
    }
    try {
      await api("/api/sensing", {
        method: "POST",
        body: JSON.stringify({
          planId, contactId, contactCoverage, tactileConfidence, visionConfidence, cueAgreement,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Tactile + vision sensing"
      subtitle="Attach tactile and vision cues to a planned contact."
    >
      {!plans.length || !contacts.length ? (
        <p className="mb-6 text-slate-500">
          Need contacts and plans — create them first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
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
        {(
          [
            ["contactCoverage", contactCoverage, setContactCoverage],
            ["tactileConfidence", tactileConfidence, setTactileConfidence],
            ["visionConfidence", visionConfidence, setVisionConfidence],
            ["cueAgreement", cueAgreement, setCueAgreement],
          ] as const
        ).map(([id, val, setter]) => (
          <div key={id}>
            <Label htmlFor={id}>{id}</Label>
            <Input
              id={id}
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={val}
              onChange={(e) => setter(Number(e.target.value))}
            />
          </div>
        ))}
        <div className="flex items-end">
          <Button onClick={() => create()}>Create sensing run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No sensing runs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{r.id}</div>
              <div className="mt-1 text-sm text-slate-500">
                contact {r.contactCoverage} · tactile {r.tactileConfidence} · vision{" "}
                {r.visionConfidence} · agreement {r.cueAgreement} · {r.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
