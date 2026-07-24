"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
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
import type { EvalRun, SlideAsset, SlideCohort } from "@/store";

export default function SlidesPage() {
  const [cohorts, setCohorts] = useState<SlideCohort[]>([]);
  const [slides, setSlides] = useState<SlideAsset[]>([]);
  const [signals, setSignals] = useState<{
    run: EvalRun;
    signals: {
      morphology: number;
      language: number;
      slide: number;
      aggregator: number;
    };
  } | null>(null);
  const [cohortId, setCohortId] = useState("");
  const [label, setLabel] = useState("");
  const [magnification, setMagnification] = useState("20x");
  const [patchCount, setPatchCount] = useState("128");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh(cid?: string) {
    start(async () => {
      const id = cid ?? cohortId;
      const s = await api<{ items: SlideAsset[] }>(
        `/api/slides?cohortId=${encodeURIComponent(id)}&pageSize=50`,
      );
      setSlides(s.items);
      const sig = await api<{
        run: EvalRun;
        signals: {
          morphology: number;
          language: number;
          slide: number;
          aggregator: number;
        };
      } | null>("/api/signals");
      setSignals(sig);
    });
  }

  useEffect(() => {
    start(async () => {
      const c = await api<{ items: SlideCohort[] }>("/api/cohorts?pageSize=50");
      setCohorts(c.items);
      const first = c.items[0]?.id ?? "";
      setCohortId(first);
      if (first) refresh(first);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createSlide() {
    start(async () => {
      try {
        await api("/api/slides", {
          method: "POST",
          body: JSON.stringify({
            cohortId,
            label,
            magnification,
            patchCount: Number(patchCount) || 1,
            notes,
          }),
        });
        setLabel("");
        refresh();
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  const bars = signals?.signals;

  return (
    <StudioShell
      title="Slide / patch inspection"
      subtitle="Inspect slide assets and signal contributions from the latest completed embed."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <div>
            <Label>Cohort</Label>
            <Select
              value={cohortId}
              onValueChange={(v) => {
                setCohortId(v);
                refresh(v);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select cohort" />
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
            <Label htmlFor="s-label">Slide label</Label>
            <Input
              id="s-label"
              className="mt-1"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="s-mag">Magnification</Label>
            <Input
              id="s-mag"
              className="mt-1"
              value={magnification}
              onChange={(e) => setMagnification(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="s-patches">Patch count</Label>
            <Input
              id="s-patches"
              className="mt-1"
              value={patchCount}
              onChange={(e) => setPatchCount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="s-notes">Notes</Label>
            <Input
              id="s-notes"
              className="mt-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={createSlide} disabled={pending || !label.trim()}>
            Add slide asset
          </Button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium text-stone-900">Signal contributions</p>
          {bars ? (
            <div className="mt-4 space-y-3">
              {(
                [
                  ["Morphology", bars.morphology, "bg-teal-800"],
                  ["Language", bars.language, "bg-rose-400"],
                  ["Slide", bars.slide, "bg-teal-600"],
                  ["Aggregator", bars.aggregator, "bg-stone-500"],
                ] as const
              ).map(([name, val, color], i) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{name}</span>
                    <span>{val}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-stone-100">
                    <div
                      className={`animate-bar-grow h-full ${color}`}
                      style={{
                        width: `${Math.min(100, val)}%`,
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="pt-2 text-xs text-stone-500">
                From run {signals?.run.slideLabel} ({signals?.run.mode})
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone-500">
              Complete an embed run to see morphology, language, and slide bars.
            </p>
          )}
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {slides.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium">{s.label}</p>
            <p className="text-sm text-stone-600">
              {s.magnification} · {s.patchCount} patches
              {s.notes ? ` · ${s.notes}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
