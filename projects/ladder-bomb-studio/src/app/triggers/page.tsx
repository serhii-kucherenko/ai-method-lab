"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { BombFinding, TriggerSynth } from "@/store";

export default function TriggersPage() {
  const [findings, setFindings] = useState<BombFinding[]>([]);
  const [items, setItems] = useState<TriggerSynth[]>([]);
  const [findingId, setFindingId] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: TriggerSynth[] }>("/api/triggers");
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const f = await api<{ items: BombFinding[] }>(
        "/api/findings?page=1&pageSize=50",
      );
      setFindings(f.items);
      if (f.items[0]) setFindingId(f.items[0].id);
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<TriggerSynth>("/api/triggers", {
          method: "POST",
          body: JSON.stringify({
            findingId,
            label: label.trim() || undefined,
          }),
        });
        setLabel("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Triggers"
      subtitle="Synthesize concrete trigger steps that fire each ladder logic bomb finding."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Synthesize trigger</p>
          <div>
            <Label htmlFor="t-finding">Finding</Label>
            <select
              id="t-finding"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={findingId}
              onChange={(e) => setFindingId(e.target.value)}
            >
              {findings.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="t-label">Label (optional)</Label>
            <Input
              id="t-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Delayed discharge deny"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !findingId} onClick={create}>
            Synthesize
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{t.label}</p>
                <Badge>{t.concrete ? "concrete" : "partial"}</Badge>
                <Badge variant="secondary">
                  recovery {t.recoveryScore}
                </Badge>
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
                {t.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
