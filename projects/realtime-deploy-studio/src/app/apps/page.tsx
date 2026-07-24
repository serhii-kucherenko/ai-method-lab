"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DeployApp } from "@/store";

export default function AppsPage() {
  const [items, setItems] = useState<DeployApp[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState("staging-b200");
  const [modalities, setModalities] = useState("audio,text,video");
  const [gpuBudget, setGpuBudget] = useState("4");
  const [targetLatencyMs, setTargetLatencyMs] = useState("220");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: DeployApp[] }>(
        `/api/apps?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
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
        await api<DeployApp>("/api/apps", {
          method: "POST",
          body: JSON.stringify({
            name,
            environment,
            modalities: modalities.split(",").map((t) => t.trim()),
            gpuBudget: Number(gpuBudget),
            targetLatencyMs: Number(targetLatencyMs),
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
      title="Deploy apps"
      subtitle="Register multimodal apps and environments before harnessed deploy plans."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-100">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-400">
          <li>Create an app with modalities, GPU budget, and latency target.</li>
          <li>Open Deploy to run a harnessed multi-check plan.</li>
          <li>Inspect Readiness, then Compare against naive single-shot.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-100">Create app</p>
          <div>
            <Label htmlFor="a-name">Name</Label>
            <Input
              id="a-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Voice agent + live avatar"
            />
          </div>
          <div>
            <Label htmlFor="a-env">Environment</Label>
            <Input
              id="a-env"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="a-mod">Modalities (comma)</Label>
            <Input
              id="a-mod"
              value={modalities}
              onChange={(e) => setModalities(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="gpu">GPU budget</Label>
              <Input
                id="gpu"
                value={gpuBudget}
                onChange={(e) => setGpuBudget(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lat">Target latency ms</Label>
              <Input
                id="lat"
                value={targetLatencyMs}
                onChange={(e) => setTargetLatencyMs(e.target.value)}
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
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button disabled={pending || !name.trim()} onClick={create}>
            Create app
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search environment / modalities"
            />
            <Button variant="outline" disabled={pending} onClick={() => load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-3">
            {items.map((app) => (
              <li
                key={app.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-100">{app.name}</p>
                  <Badge variant="secondary">{app.environment}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {app.modalities.join(" · ")} · {app.gpuBudget} GPU · target{" "}
                  {app.targetLatencyMs} ms
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
