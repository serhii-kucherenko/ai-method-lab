"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DomainKind, ErpDomain } from "@/store";

const KINDS: DomainKind[] = [
  "finance",
  "supply",
  "hr",
  "manufacturing",
  "procurement",
];

export default function DomainsPage() {
  const [items, setItems] = useState<ErpDomain[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<DomainKind>("supply");
  const [complexity, setComplexity] = useState("0.65");
  const [crossLinks, setCrossLinks] = useState("2");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: ErpDomain[] }>(
        `/api/domains?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<ErpDomain>("/api/domains", {
          method: "POST",
          body: JSON.stringify({
            name,
            kind,
            complexity: Number(complexity),
            crossLinks: Number(crossLinks),
            notes,
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="ERP domains"
      subtitle="Workspaces for finance, supply, HR, manufacturing, and procurement planning."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Create an ERP domain with complexity and cross-domain links.</li>
          <li>Attach role agents on Agents, then run a plan on Plans.</li>
          <li>Compare multi-agent vs single-agent, then export from Runs.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Create domain</p>
          <div>
            <Label htmlFor="d-name">Name</Label>
            <Input
              id="d-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Quarterly capacity plan"
            />
          </div>
          <div>
            <Label htmlFor="d-kind">Kind</Label>
            <select
              id="d-kind"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as DomainKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="cx">Complexity</Label>
              <Input
                id="cx"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="xl">Cross links</Label>
              <Input
                id="xl"
                value={crossLinks}
                onChange={(e) => setCrossLinks(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim()} onClick={create}>
            Create domain
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search domains"
            />
            <Button variant="outline" onClick={() => load(q)}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((d) => (
              <li
                key={d.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <Badge variant="secondary">{d.kind}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Complexity {d.complexity.toFixed(2)} · Cross links{" "}
                  {d.crossLinks}
                </p>
                {d.notes ? (
                  <p className="mt-1 text-sm text-slate-400">{d.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
