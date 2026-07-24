"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { BombFinding, BombTaxonomy, TriggerSynth } from "@/store";

const TAXONOMY: BombTaxonomy[] = [
  "hidden-timer",
  "interlock-bypass",
  "actuator-deny",
  "nested-fb",
  "hmi-override",
  "scan-starve",
];

export default function FindingsPage() {
  const [items, setItems] = useState<BombFinding[]>([]);
  const [scans, setScans] = useState<{ id: string; name: string }[]>([]);
  const [scanId, setScanId] = useState("");
  const [taxonomy, setTaxonomy] = useState<BombTaxonomy>("hidden-timer");
  const [filterTax, setFilterTax] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(tax = filterTax) {
    start(async () => {
      const qs = new URLSearchParams({ page: "1", pageSize: "30" });
      if (tax) qs.set("taxonomy", tax);
      const res = await api<{ items: BombFinding[] }>(
        `/api/findings?${qs.toString()}`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const scanRes = await api<{ items: { id: string; name: string }[] }>(
        "/api/scans?page=1&pageSize=50",
      );
      setScans(scanRes.items);
      if (scanRes.items[0]) setScanId(scanRes.items[0].id);
      load("");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<BombFinding>("/api/findings", {
          method: "POST",
          body: JSON.stringify({ scanId, taxonomy }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function advance(id: string, status: BombFinding["status"]) {
    start(async () => {
      await api("/api/findings", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      });
      load();
    });
  }

  function synth(findingId: string) {
    start(async () => {
      await api<TriggerSynth>("/api/triggers", {
        method: "POST",
        body: JSON.stringify({ findingId }),
      });
    });
  }

  async function exportJson() {
    const text = await api<string>("/api/findings?export=json");
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "findings.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Findings"
      subtitle="Bomb detections with taxonomy — triage, resolve, and export JSON."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <select
          className="flex h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={filterTax}
          onChange={(e) => {
            setFilterTax(e.target.value);
            load(e.target.value);
          }}
        >
          <option value="">All taxonomy</option>
          {TAXONOMY.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <Button variant="outline" onClick={exportJson}>
          Export JSON
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Record finding</p>
          <div>
            <Label htmlFor="f-scan">Scan</Label>
            <select
              id="f-scan"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={scanId}
              onChange={(e) => setScanId(e.target.value)}
            >
              {scans.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="f-tax">Taxonomy</Label>
            <select
              id="f-tax"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={taxonomy}
              onChange={(e) => setTaxonomy(e.target.value as BombTaxonomy)}
            >
              {TAXONOMY.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !scanId} onClick={create}>
            Add finding
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((f, i) => (
            <li
              key={f.id}
              className="animate-finding-reveal rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{f.title}</p>
                <Badge>{f.taxonomy}</Badge>
                <Badge variant="secondary">{f.severity}</Badge>
                <Badge variant="outline">{f.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Suspicion {f.suspicion} · {f.detail}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => advance(f.id, "triaged")}
                >
                  Triage
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => advance(f.id, "resolved")}
                >
                  Resolve
                </Button>
                <Button size="sm" onClick={() => synth(f.id)}>
                  Synthesize trigger
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
