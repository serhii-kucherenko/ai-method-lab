"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Register a sign stream",
    body: "Create a language-pair stream so segments and budgets have a home.",
  },
  {
    title: "Add a sentence segment",
    body: "Cut a gloss sentence with boundary confidence.",
  },
  {
    title: "Set latency + glossary",
    body: "Add a latency budget and a glossary coverage term.",
  },
  {
    title: "Compare real-time vs offline-batch",
    body: "Run dual scoring A vs B and see the winner.",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function runStep(index: number) {
    setBusy(true);
    setError("");
    try {
      if (index === 0) {
        const stream = await api<{ id: string; label: string }>("/api/streams", {
          method: "POST",
          body: JSON.stringify({
            label: `Demo stream ${Date.now()}`,
            languagePair: "ASL→EN",
            signerPace: 0.38,
            motionStability: 0.8,
            occlusionNoise: 0.15,
            status: "live",
          }),
        });
        setLog((prev) => [...prev, `Stream created: ${stream.label}`]);
        sessionStorage.setItem("sss-demo-stream", stream.id);
      } else if (index === 1) {
        const streamId = sessionStorage.getItem("sss-demo-stream");
        if (!streamId) throw new Error("missing_stream");
        const seg = await api<{ id: string; glossText: string }>(
          "/api/sentences",
          {
            method: "POST",
            body: JSON.stringify({
              streamId,
              glossText: "HELLO WHERE LIBRARY",
              boundaryConfidence: 0.84,
              startMs: 200,
              endMs: 2100,
              status: "active",
            }),
          },
        );
        sessionStorage.setItem("sss-demo-segment", seg.id);
        setLog((prev) => [...prev, `Segment added: ${seg.glossText}`]);
      } else if (index === 2) {
        const streamId = sessionStorage.getItem("sss-demo-stream");
        if (!streamId) throw new Error("missing_stream");
        const budget = await api<{ id: string; budgetMs: number }>(
          "/api/latency",
          {
            method: "POST",
            body: JSON.stringify({
              streamId,
              budgetMs: 750,
              jitterMs: 40,
              flushPolicy: "wait_boundary",
              status: "active",
            }),
          },
        );
        await api("/api/glossary", {
          method: "POST",
          body: JSON.stringify({
            streamId,
            term: "LIBRARY",
            coverage: 0.92,
            priority: "core",
          }),
        });
        sessionStorage.setItem("sss-demo-budget", budget.id);
        setLog((prev) => [
          ...prev,
          `Latency budget ${budget.budgetMs}ms + glossary term`,
        ]);
      } else if (index === 3) {
        const streamId = sessionStorage.getItem("sss-demo-stream");
        const segmentId = sessionStorage.getItem("sss-demo-segment");
        const budgetId = sessionStorage.getItem("sss-demo-budget");
        if (!streamId || !segmentId || !budgetId) throw new Error("missing_ids");
        const cmp = await api<{
          winner: string;
          realtime: { overall: number };
          offlineBatch: { overall: number };
        }>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name: "Guided demo compare",
            streamId,
            segmentId,
            budgetId,
          }),
        });
        setLog((prev) => [
          ...prev,
          `Compare winner: ${cmp.winner} (A ${cmp.realtime.overall} vs B ${cmp.offlineBatch.overall})`,
        ]);
        setDone(true);
      }
      setStep(Math.min(index + 1, STEPS.length));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Step-by-step happy path: stream → sentence → latency/glossary → compare."
    >
      <ol className="space-y-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-lime)]">
                  Step {i + 1}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {s.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
              <Button
                disabled={busy || i > step || (i < step && i !== step)}
                onClick={() => runStep(i)}
              >
                {i < step ? "Done" : busy && i === step ? "Running…" : "Run step"}
              </Button>
            </div>
          </li>
        ))}
      </ol>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {log.length > 0 ? (
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {log.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {done ? (
        <p className="mt-6 text-sm text-slate-600">
          Demo complete. Explore{" "}
          <Link href="/compare" className="underline">
            compare
          </Link>{" "}
          or{" "}
          <Link href="/streams" className="underline">
            streams
          </Link>
          .
        </p>
      ) : null}
    </StudioShell>
  );
}
