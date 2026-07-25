"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { FailureDiagnosis, TrackProbe } from "@/store";

export default function FailuresPage() {
  const [items, setItems] = useState<FailureDiagnosis[]>([]);
  const [probes, setProbes] = useState<TrackProbe[]>([]);
  const [probeId, setProbeId] = useState("");
  const [note, setNote] = useState("");
  const [taxonomy, setTaxonomy] = useState("name_invariant");
  const [error, setError] = useState("");

  async function load() {
    const [fails, p] = await Promise.all([
      api<{ items: FailureDiagnosis[] }>("/api/failures"),
      api<{ items: TrackProbe[] }>("/api/probes"),
    ]);
    setItems(fails.items);
    setProbes(p.items);
    if (!probeId && p.items[0]) setProbeId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/failures", {
        method: "POST",
        body: JSON.stringify({
          probeId,
          taxonomy,
          severity: 0.65,
          evidenceNote: note,
        }),
      });
      setNote("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Failure diagnoses"
      subtitle="Taxonomy for name-invariant, gender-cue, option-bias, open-ended collapse, and shallow frames."
    >
      {probes.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          Select or create a probe first — diagnoses attach to probes.
        </p>
      ) : null}

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={probeId}
          onChange={(e) => setProbeId(e.target.value)}
        >
          {probes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.probeKind} · {p.swapTargetName}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={taxonomy}
          onChange={(e) => setTaxonomy(e.target.value)}
        >
          <option value="name_invariant">name_invariant</option>
          <option value="gender_cue">gender_cue</option>
          <option value="option_bias">option_bias</option>
          <option value="open_ended_collapse">open_ended_collapse</option>
          <option value="shallow_frames">shallow_frames</option>
        </select>
        <Input
          className="md:col-span-2"
          placeholder="Evidence note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit">Add diagnosis</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((f) => (
          <li
            key={f.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {f.taxonomy}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                severity {f.severity}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {f.evidenceNote || "—"}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
