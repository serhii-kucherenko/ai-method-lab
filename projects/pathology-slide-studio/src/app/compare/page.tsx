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
import type { CompareResult, SlideCohort } from "@/store";

export default function ComparePage() {
  const [cohorts, setCohorts] = useState<SlideCohort[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [name, setName] = useState("Multi-signal vs vision-only");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  useEffect(() => {
    start(async () => {
      const c = await api<{ items: SlideCohort[] }>("/api/cohorts?pageSize=50");
      setCohorts(c.items);
      if (c.items[0]) setCohortId(c.items[0].id);
      const cmp = await api<{ items: CompareResult[] }>("/api/compare");
      setRows(cmp.items);
    });
  }, []);

  function runCompare() {
    start(async () => {
      try {
        const row = await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name,
            cohortId,
            embedInput: {
              patchMorphology: 0.78,
              textureEntropy: 0.6,
              stainQuality: 0.84,
              languageAlign: 0.72,
              conceptMatch: 0.68,
              slideContext: 0.75,
              tissueHeterogeneity: 0.55,
              milAggregator: 70,
              profile: "full",
            },
          }),
        });
        setRows((prev) => [row, ...prev]);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Multi-signal vs vision-only"
      subtitle="Compare multi-signal embeddings against a vision-only baseline on the same inputs."
    >
      <div className="mb-8 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-3">
        <div>
          <Label>Cohort</Label>
          <Select value={cohortId} onValueChange={setCohortId}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cohorts.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cmp-name">Compare name</Label>
          <Input
            id="cmp-name"
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={runCompare} disabled={pending || !cohortId}>
            Run compare
          </Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-4">
        {rows.map((row) => (
          <li
            key={row.id}
            className="animate-fade-up rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{row.name}</p>
              <Badge variant="secondary">
                Winner:{" "}
                {row.winner === "multi_signal"
                  ? "multi-signal"
                  : row.winner === "vision_only"
                    ? "vision-only"
                    : "tie"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-stone-600">Multi-signal</p>
                <p className="text-2xl font-medium text-[var(--studio-teal-ink)]">
                  {row.multiSignal.overall}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded bg-stone-100">
                  <div
                    className="animate-bar-grow h-full bg-teal-800"
                    style={{ width: `${row.multiSignal.overall}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-stone-600">Vision-only</p>
                <p className="text-2xl font-medium text-stone-700">
                  {row.visionOnly.overall}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded bg-stone-100">
                  <div
                    className="animate-bar-grow h-full bg-stone-500 [animation-delay:100ms]"
                    style={{ width: `${row.visionOnly.overall}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
