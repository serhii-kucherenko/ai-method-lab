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
import type { ClassStat, EcgCohort } from "@/store";

export default function ClassesPage() {
  const [cohorts, setCohorts] = useState<EcgCohort[]>([]);
  const [stats, setStats] = useState<ClassStat[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [rhythmCode, setRhythmCode] = useState("LBBB");
  const [label, setLabel] = useState("Left bundle branch block");
  const [sampleCount, setSampleCount] = useState("120");
  const [prevalence, setPrevalence] = useState("0.01");
  const [isTail, setIsTail] = useState("true");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(cid?: string) {
    start(async () => {
      const c = await api<{ items: EcgCohort[] }>("/api/cohorts?pageSize=50");
      setCohorts(c.items);
      const id = cid || cohortId || c.items[0]?.id || "";
      if (!cohortId && id) setCohortId(id);
      if (!id) return;
      const s = await api<{ items: ClassStat[] }>(
        `/api/classes?cohortId=${encodeURIComponent(id)}`,
      );
      setStats(s.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveClass() {
    start(async () => {
      try {
        await api<ClassStat>("/api/classes", {
          method: "POST",
          body: JSON.stringify({
            cohortId,
            rhythmCode,
            label,
            sampleCount: Number(sampleCount),
            prevalence: Number(prevalence),
            isTail: isTail === "true",
          }),
        });
        setError("");
        load(cohortId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  const maxPrev = Math.max(...stats.map((s) => s.prevalence), 0.01);

  return (
    <StudioShell
      title="Class balance / rare rhythms"
      subtitle="Inspect head vs tail prevalence before trusting macro metrics."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium">Upsert rhythm class</p>
          <div>
            <Label>Cohort</Label>
            <Select
              value={cohortId}
              onValueChange={(v) => {
                setCohortId(v);
                load(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cohort" />
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
            <Label htmlFor="code">Rhythm code</Label>
            <Input
              id="code"
              value={rhythmCode}
              onChange={(e) => setRhythmCode(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="count">Samples</Label>
              <Input
                id="count"
                value={sampleCount}
                onChange={(e) => setSampleCount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prev">Prevalence</Label>
              <Input
                id="prev"
                value={prevalence}
                onChange={(e) => setPrevalence(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Tail class?</Label>
            <Select value={isTail} onValueChange={setIsTail}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes — rare / tail</SelectItem>
                <SelectItem value="false">No — head</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !cohortId} onClick={saveClass}>
            Save class
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Class prevalence bars (relative within cohort)
          </p>
          {stats.map((s, i) => (
            <div
              key={s.id}
              className="rounded-lg border border-[var(--studio-line)] bg-white p-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  {s.rhythmCode} · {s.label}
                </span>
                <Badge variant={s.isTail ? "default" : "secondary"}>
                  {s.isTail ? "tail" : "head"}
                </Badge>
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-slate-100">
                <div
                  className="animate-bar-grow h-full rounded bg-[var(--studio-coral)]"
                  style={{
                    width: `${Math.max(4, (s.prevalence / maxPrev) * 100)}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {(s.prevalence * 100).toFixed(2)}% · {s.sampleCount} samples
              </p>
            </div>
          ))}
        </div>
      </div>
    </StudioShell>
  );
}
