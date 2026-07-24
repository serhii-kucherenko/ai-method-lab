"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { LlmDeployment, PromptAsset } from "@/store";

export default function PromptsPage() {
  const [deps, setDeps] = useState<LlmDeployment[]>([]);
  const [items, setItems] = useState<PromptAsset[]>([]);
  const [deploymentId, setDeploymentId] = useState("");
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [prefixTokens, setPrefixTokens] = useState("2000");
  const [suffixTokens, setSuffixTokens] = useState("400");
  const [sharedPrefix, setSharedPrefix] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q, dep = deploymentId) {
    start(async () => {
      const qs = new URLSearchParams({
        q: search,
        page: "1",
        pageSize: "20",
      });
      if (dep) qs.set("deploymentId", dep);
      const res = await api<{ items: PromptAsset[] }>(`/api/prompts?${qs}`);
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const res = await api<{ items: LlmDeployment[] }>(
        "/api/deployments?page=1&pageSize=50",
      );
      setDeps(res.items);
      if (res.items[0]) setDeploymentId(res.items[0].id);
      const prompts = await api<{ items: PromptAsset[] }>(
        "/api/prompts?page=1&pageSize=20",
      );
      setItems(prompts.items);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<PromptAsset>("/api/prompts", {
          method: "POST",
          body: JSON.stringify({
            deploymentId,
            name,
            prefixTokens: Number(prefixTokens),
            suffixTokens: Number(suffixTokens),
            sharedPrefix,
            notes,
          }),
        });
        setName("");
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
      title="Prompts"
      subtitle="Manage shared prefixes and query suffixes so cache-aware policies know what to preserve."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Add prompt asset</p>
          <div>
            <Label htmlFor="p-dep">Deployment</Label>
            <select id="p-dep" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={deploymentId} onChange={(e) => setDeploymentId(e.target.value)}>
              {deps.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="System + tools prefix" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="p-pre">Prefix tokens</Label>
              <Input id="p-pre" value={prefixTokens} onChange={(e) => setPrefixTokens(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="p-suf">Suffix tokens</Label>
              <Input id="p-suf" value={suffixTokens} onChange={(e) => setSuffixTokens(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={sharedPrefix} onChange={(e) => setSharedPrefix(e.target.checked)} />
            Shared / cacheable prefix
          </label>
          <div>
            <Label htmlFor="p-notes">Notes</Label>
            <Input id="p-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !deploymentId} onClick={create}>
            Add prompt
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts" />
            <Button variant="outline" onClick={() => load()}>Search</Button>
          </div>
          <ul className="space-y-2">
            {items.map((p) => (
              <li key={p.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{p.name}</p>
                  {p.sharedPrefix ? <Badge>shared</Badge> : <Badge variant="outline">private</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  prefix {p.prefixTokens} · suffix {p.suffixTokens} · {p.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
