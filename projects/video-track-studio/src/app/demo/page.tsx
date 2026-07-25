"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Register a long-form clip",
    body: "Create an episode clip so cast and probes have a home.",
  },
  {
    title: "Add a named character",
    body: "Bind a cast member with outfit-change count to that clip.",
  },
  {
    title: "Run a name-swap track probe",
    body: "Probe whether answers move when the question names a different person.",
  },
  {
    title: "Diagnose + compare track vs fluency",
    body: "Record a failure taxonomy and run dual scoring A vs B.",
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
        const clip = await api<{ id: string; title: string }>("/api/clips", {
          method: "POST",
          body: JSON.stringify({
            title: `Guided demo clip ${Date.now()}`,
            showLabel: "Demo Show",
            durationMin: 24,
            frameCount: 16,
            status: "ready",
          }),
        });
        setLog((prev) => [...prev, `Clip created: ${clip.title}`]);
        sessionStorage.setItem("vts-demo-clip", clip.id);
      } else if (index === 1) {
        const clipId = sessionStorage.getItem("vts-demo-clip");
        if (!clipId) throw new Error("missing_clip");
        const character = await api<{ id: string; name: string }>(
          "/api/characters",
          {
            method: "POST",
            body: JSON.stringify({
              clipId,
              name: "DemoLead",
              genderCue: "same",
              castRank: 1,
              outfitChangeCount: 3,
            }),
          },
        );
        sessionStorage.setItem("vts-demo-char", character.id);
        setLog((prev) => [...prev, `Character added: ${character.name}`]);
      } else if (index === 2) {
        const clipId = sessionStorage.getItem("vts-demo-clip");
        const characterId = sessionStorage.getItem("vts-demo-char");
        if (!clipId || !characterId) throw new Error("missing_clip_or_char");
        const probe = await api<{ id: string; probeKind: string }>(
          "/api/probes",
          {
            method: "POST",
            body: JSON.stringify({
              clipId,
              characterId,
              probeKind: "name_swap",
              swapTargetName: "OtherCast",
              sensitivity: 0.3,
              identityBind: 0.35,
              temporalCoverage: 0.55,
              fluencyPrior: 0.75,
              status: "running",
            }),
          },
        );
        sessionStorage.setItem("vts-demo-probe", probe.id);
        setLog((prev) => [...prev, `Probe running: ${probe.probeKind}`]);
      } else if (index === 3) {
        const clipId = sessionStorage.getItem("vts-demo-clip");
        const characterId = sessionStorage.getItem("vts-demo-char");
        const probeId = sessionStorage.getItem("vts-demo-probe");
        if (!clipId || !characterId || !probeId) {
          throw new Error("missing_ids");
        }
        await api("/api/failures", {
          method: "POST",
          body: JSON.stringify({
            probeId,
            taxonomy: "name_invariant",
            severity: 0.7,
            evidenceNote: "Guided demo: swap rarely changes answer",
          }),
        });
        const cmp = await api<{
          winner: string;
          trackAware: { overall: number };
          fluency: { overall: number };
        }>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name: "Guided demo compare",
            clipId,
            characterId,
            probeId,
          }),
        });
        setLog((prev) => [
          ...prev,
          `Failure logged · Compare winner ${cmp.winner} (A ${cmp.trackAware.overall} vs B ${cmp.fluency.overall})`,
        ]);
        setDone(true);
      }
      if (index < STEPS.length - 1) setStep(index + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Step-by-step happy path in-app — separate from offline try.html."
    >
      <ol className="mb-8 space-y-4">
        {STEPS.map((s, i) => {
          const active = i === step;
          const complete = i < step || (done && i === STEPS.length - 1);
          return (
            <li
              key={s.title}
              className={
                active
                  ? "rounded-lg border-2 border-[var(--studio-coral)] bg-[var(--studio-panel)] p-4"
                  : "rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Step {i + 1}
                    {complete ? " · done" : active ? " · current" : ""}
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                    {s.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{s.body}</p>
                </div>
                {active && !done ? (
                  <Button
                    type="button"
                    disabled={busy}
                    onClick={() => runStep(i)}
                  >
                    {busy ? "Working…" : `Run step ${i + 1}`}
                  </Button>
                ) : null}
                {done && i === STEPS.length - 1 ? (
                  <Button asChild variant="secondary">
                    <Link href="/compare">Open compare</Link>
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {log.length > 0 ? (
        <div className="rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <h3 className="font-[family-name:var(--font-display)] text-lg">
            Demo log
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-slate-500">
        Prefer offline? Use repo-root <code>try.html</code> — approximate
        soft-sim only, separate from this guided in-app path.
      </p>
    </StudioShell>
  );
}
