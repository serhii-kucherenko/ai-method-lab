"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { DeployApp, ReadinessCheck } from "@/store";

export default function ReadinessPage() {
  const [apps, setApps] = useState<DeployApp[]>([]);
  const [checks, setChecks] = useState<ReadinessCheck[]>([]);
  const [appId, setAppId] = useState("");
  const [kind, setKind] = useState<ReadinessCheck["kind"]>("latency");
  const [label, setLabel] = useState("TTFO budget");
  const [threshold, setThreshold] = useState("70");
  const [observed, setObserved] = useState("72");
  const [pending, start] = useTransition();

  function refresh(selected = appId) {
    start(async () => {
      const a = await api<{ items: DeployApp[] }>("/api/apps?page=1&pageSize=50");
      setApps(a.items);
      const id = selected || a.items[0]?.id || "";
      if (!appId && id) setAppId(id);
      const q = id ? `?appId=${encodeURIComponent(id)}` : "";
      const r = await api<{ items: ReadinessCheck[] }>(`/api/readiness${q}`);
      setChecks(r.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    start(async () => {
      await api("/api/readiness", {
        method: "POST",
        body: JSON.stringify({
          appId,
          kind,
          label,
          threshold: Number(threshold),
          observed: Number(observed),
        }),
      });
      refresh(appId);
    });
  }

  return (
    <StudioShell
      title="Latency / multimodal readiness"
      subtitle="Track TTFO, throughput, multimodal sync, and correctness gates."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="animate-pulse-ready size-3 rounded-full bg-[var(--studio-amber)]" />
        <p className="text-sm text-slate-400">
          Readiness pulse — promote only when all gates clear.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-100">Upsert readiness check</p>
          <div>
            <Label>App</Label>
            <Select
              value={appId}
              onValueChange={(v) => {
                setAppId(v);
                refresh(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select app" />
              </SelectTrigger>
              <SelectContent>
                {apps.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Kind</Label>
            <Select
              value={kind}
              onValueChange={(v) => setKind(v as ReadinessCheck["kind"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latency">latency</SelectItem>
                <SelectItem value="throughput">throughput</SelectItem>
                <SelectItem value="multimodal">multimodal</SelectItem>
                <SelectItem value="correctness">correctness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rl">Label</Label>
            <Input
              id="rl"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="th">Threshold</Label>
              <Input
                id="th"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ob">Observed</Label>
              <Input
                id="ob"
                value={observed}
                onChange={(e) => setObserved(e.target.value)}
              />
            </div>
          </div>
          <Button disabled={pending || !appId} onClick={save}>
            Save check
          </Button>
        </div>

        <ul className="space-y-3">
          {checks.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-100">{c.label}</p>
                <Badge variant={c.ready ? "default" : "secondary"}>
                  {c.ready ? "ready" : "gap"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {c.kind} · observed {c.observed} / threshold {c.threshold}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded bg-slate-800">
                <div
                  className="h-full bg-[var(--studio-amber)] transition-all"
                  style={{
                    width: `${Math.min(100, (c.observed / Math.max(1, c.threshold)) * 100)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
