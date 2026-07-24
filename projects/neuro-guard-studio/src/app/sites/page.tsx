"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { IiotSite, SiteCriticality } from "@/store";

const CRIT: SiteCriticality[] = ["low", "medium", "high", "critical"];

export default function SitesPage() {
  const [items, setItems] = useState<IiotSite[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [criticality, setCriticality] = useState<SiteCriticality>("high");
  const [zone, setZone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: IiotSite[] }>(
        `/api/sites?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
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
        await api<IiotSite>("/api/sites", {
          method: "POST",
          body: JSON.stringify({ name, code, criticality, zone, notes }),
        });
        setName("");
        setCode("");
        setZone("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Sites"
      subtitle="Register industrial IoT sites with zone and criticality before drafting defense plans."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Create a site with code, zone, and criticality.</li>
          <li>Attach sensors, draft a neuro-agentic plan, run CPI.</li>
          <li>Propose interventions and compare against reactive baselines.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Register site</p>
          <div>
            <Label htmlFor="s-name">Name</Label>
            <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Bay Compressors West" />
          </div>
          <div>
            <Label htmlFor="s-code">Code</Label>
            <Input id="s-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="BCW-01" />
          </div>
          <div>
            <Label htmlFor="s-crit">Criticality</Label>
            <select id="s-crit" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={criticality} onChange={(e) => setCriticality(e.target.value as SiteCriticality)}>
              {CRIT.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="s-zone">Zone</Label>
            <Input id="s-zone" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="OT-Line-3" />
          </div>
          <div>
            <Label htmlFor="s-notes">Notes</Label>
            <Input id="s-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !code.trim()} onClick={create}>
            Register site
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code / zone / criticality" />
            <Button variant="outline" onClick={() => load(q)}>Search</Button>
          </div>
          <ul className="space-y-2">
            {items.map((s) => (
              <li key={s.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{s.name}</p>
                  <Badge variant="secondary">{s.code}</Badge>
                  <Badge>{s.criticality}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {s.zone || "No zone"} · {s.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
