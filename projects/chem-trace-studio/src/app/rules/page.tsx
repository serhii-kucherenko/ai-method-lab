"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Rule = {
  id: string;
  packId: string;
  label: string;
  domain: string;
  fromState: string;
  toState: string;
  allowWeight: number;
  denyWeight: number;
  metricHint: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function RulesPage() {
  const [items, setItems] = useState<Rule[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Allow DFT→MD handoff");
  const [domain, setDomain] = useState("dft");
  const [fromState, setFromState] = useState("dft_complete");
  const [toState, setToState] = useState("md_ready");
  const [allowWeight, setAllowWeight] = useState("0.58");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [rules, packsRes] = await Promise.all([
      api<{ items: Rule[] }>(`/api/rules?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/workflows"),
    ]);
    setItems(rules.items);
    setPacks(packsRes.items);
    if (!packId && packsRes.items[0]) setPackId(packsRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/rules", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          domain,
          fromState,
          toState,
          allowWeight: Number(allowWeight),
          metricHint: "ASP allow/deny + trace diagnosis",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Trace-state rules"
      subtitle="Define ASP allow/deny transitions, from/to states, and soft-sim metrics."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search rules"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="pack">Workflow pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="domain">Domain</Label>
          <select
            id="domain"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option value="dft">DFT</option>
            <option value="md">MD</option>
            <option value="qm">QM</option>
            <option value="retrosynthesis">Retrosynthesis</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <Label htmlFor="from">From state</Label>
          <Input
            id="from"
            value={fromState}
            onChange={(e) => setFromState(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="to">To state</Label>
          <Input
            id="to"
            value={toState}
            onChange={(e) => setToState(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="allow">Allow weight</Label>
          <Input
            id="allow"
            value={allowWeight}
            onChange={(e) => setAllowWeight(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create trace rule</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((t) => (
          <li
            key={t.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{t.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {t.domain} · {t.fromState} → {t.toState} · allow {t.allowWeight} ·
              deny {t.denyWeight} · {t.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
