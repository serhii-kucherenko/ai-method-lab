"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset } from "@/store";

export default function ChartsPage() {
  const [items, setItems] = useState<ChartAsset[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("bar");
  const [seriesLabel, setSeriesLabel] = useState("");
  const [categoryCount, setCategoryCount] = useState("4");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: ChartAsset[] }>(
        `/api/charts?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
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
        await api("/api/charts", {
          method: "POST",
          body: JSON.stringify({
            title,
            kind,
            seriesLabel,
            categoryCount: Number(categoryCount) || 4,
            notes,
          }),
        });
        setTitle("");
        setSeriesLabel("");
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
      title="Chart library"
      subtitle="Register chart assets for blind and low-vision conversational exploration."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Add a chart asset with kind and series label.</li>
          <li>Configure tactile layers and feedback grammar.</li>
          <li>Run a session, verify turns, then compare vs visual-only.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New chart</p>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quarterly revenue…" />
          </div>
          <div>
            <Label>Kind</Label>
            <Input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="bar | line | pie | scatter" />
          </div>
          <div>
            <Label>Series label</Label>
            <Input value={seriesLabel} onChange={(e) => setSeriesLabel(e.target.value)} />
          </div>
          <div>
            <Label>Category count</Label>
            <Input value={categoryCount} onChange={(e) => setCategoryCount(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !title.trim() || !seriesLabel.trim()}
            onClick={create}
          >
            Create chart
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search charts…" />
            <Button variant="outline" onClick={() => load()} disabled={pending}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge variant="secondary">{item.kind}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {item.seriesLabel} · {item.categoryCount} categories
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
