"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Register a match candidate",
    body: "Create a driver–order pair so holds and lanes have a home.",
  },
  {
    title: "Assign an experience hold",
    body: "Choose a hold tier and budget before first-feasible lock.",
  },
  {
    title: "Score lanes + timeline",
    body: "Add passenger/driver lanes and a hold/release timeline.",
  },
  {
    title: "Compare experience vs first-feasible",
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
        const match = await api<{ id: string; orderLabel: string }>(
          "/api/matches",
          {
            method: "POST",
            body: JSON.stringify({
              orderLabel: `ORD-DEMO-${Date.now()}`,
              driverLabel: "DRV-DEMO",
              zone: "Demo Zone",
              pickupEtaMin: 5,
              fareProxy: 0.7,
              supplyDemandStress: 0.4,
              status: "open",
            }),
          },
        );
        setLog((prev) => [...prev, `Match created: ${match.orderLabel}`]);
        sessionStorage.setItem("hms-demo-match", match.id);
      } else if (index === 1) {
        const matchId = sessionStorage.getItem("hms-demo-match");
        if (!matchId) throw new Error("missing_match");
        const hold = await api<{ id: string; tier: string }>("/api/holds", {
          method: "POST",
          body: JSON.stringify({
            matchId,
            tier: "hold_short",
            holdBudgetSec: 16,
            passengerWaitRisk: 0.32,
            driverIdleCost: 0.27,
            cancelBeforeAccept: 0.2,
            cancelAfterAccept: 0.16,
            status: "active",
          }),
        });
        sessionStorage.setItem("hms-demo-hold", hold.id);
        setLog((prev) => [...prev, `Hold assigned: ${hold.tier}`]);
      } else if (index === 2) {
        const matchId = sessionStorage.getItem("hms-demo-match");
        if (!matchId) throw new Error("missing_match");
        await api("/api/lanes", {
          method: "POST",
          body: JSON.stringify({
            matchId,
            side: "passenger",
            waitScore: 64,
            cancelScore: 60,
            completionScore: 72,
            incomeOrFareScore: 70,
          }),
        });
        await api("/api/lanes", {
          method: "POST",
          body: JSON.stringify({
            matchId,
            side: "driver",
            waitScore: 58,
            cancelScore: 62,
            completionScore: 75,
            incomeOrFareScore: 71,
          }),
        });
        await api("/api/timelines", {
          method: "POST",
          body: JSON.stringify({
            matchId,
            horizonSec: 90,
            notes: "Guided demo timeline",
            events: [
              { atSec: 0, kind: "candidate", detail: "Observed" },
              { atSec: 3, kind: "hold_start", detail: "hold_short" },
              { atSec: 16, kind: "hold_release", detail: "Released" },
            ],
          }),
        });
        setLog((prev) => [...prev, "Lanes + timeline recorded"]);
      } else if (index === 3) {
        const matchId = sessionStorage.getItem("hms-demo-match");
        const holdId = sessionStorage.getItem("hms-demo-hold");
        if (!matchId || !holdId) throw new Error("missing_ids");
        const cmp = await api<{
          winner: string;
          experienceAware: { overall: number };
          firstFeasible: { overall: number };
        }>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name: "Guided demo compare",
            matchId,
            holdId,
          }),
        });
        setLog((prev) => [
          ...prev,
          `Compare winner: ${cmp.winner} (A ${cmp.experienceAware.overall} vs B ${cmp.firstFeasible.overall})`,
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
      subtitle="Step-by-step happy path: match → hold → lanes/timeline → compare."
    >
      <ol className="space-y-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-teal)]">
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
          <Link href="/holds" className="underline">
            holds
          </Link>
          .
        </p>
      ) : null}
    </StudioShell>
  );
}
