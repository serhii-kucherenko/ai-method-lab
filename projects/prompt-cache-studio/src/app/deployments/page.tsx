"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { LlmDeployment, ProviderKind } from "@/store";

const PROVIDERS: ProviderKind[] = ["anthropic", "openai", "google", "other"];

export default function DeploymentsPage() {
  const [items, setItems] = useState<LlmDeployment[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<ProviderKind>("anthropic");
  const [model, setModel] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: LlmDeployment[] }>(
        `/api/deployments?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
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
        await api<LlmDeployment>("/api/deployments", {
          method: "POST",
          body: JSON.stringify({ name, provider, model, region, notes }),
        });
        setName("");
        setModel("");
        setRegion("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Deployments"
      subtitle="Register LLM API deployments before attaching shared prefixes and cache-aware policies."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Create a deployment with provider, model, and region.</li>
          <li>Add shared prompt prefixes, then activate a cache-aware policy.</li>
          <li>Estimate two-tier cost, audit hits, and compare vs naive-bust.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Register deployment</p>
          <div>
            <Label htmlFor="d-name">Name</Label>
            <Input id="d-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Assist API · us-east" />
          </div>
          <div>
            <Label htmlFor="d-prov">Provider</Label>
            <select id="d-prov" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={provider} onChange={(e) => setProvider(e.target.value as ProviderKind)}>
              {PROVIDERS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="d-model">Model</Label>
            <Input id="d-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="claude-sonnet" />
          </div>
          <div>
            <Label htmlFor="d-region">Region</Label>
            <Input id="d-region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="us-east-1" />
          </div>
          <div>
            <Label htmlFor="d-notes">Notes</Label>
            <Input id="d-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !model.trim()} onClick={create}>
            Register deployment
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search deployments" />
            <Button variant="outline" onClick={() => load()}>Search</Button>
          </div>
          <ul className="space-y-2">
            {items.map((d) => (
              <li key={d.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <Badge variant="secondary">{d.provider}</Badge>
                  <Badge variant="outline">{d.region}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{d.model} · {d.notes || "No notes"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
