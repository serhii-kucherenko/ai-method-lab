"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Register an empirical claim",
    body: "Create a claim that needs tool-backed evidence — not fluent prose alone.",
  },
  {
    title: "Attach a tool attestation",
    body: "Bind a calc / search / code / retrieval tool digest to that claim.",
  },
  {
    title: "Walk a soft-sim proof step",
    body: "Add a kernel step and mark soft-sim OK before seal.",
  },
  {
    title: "Compare attested vs fluent-only",
    body: "Run dual scoring so fluent confidence cannot fake verification.",
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
        const claim = await api<{ id: string; title: string }>("/api/claims", {
          method: "POST",
          body: JSON.stringify({
            title: `Guided demo claim ${Date.now()}`,
            statement: "Demo empirical claim for soft-sim attest path",
            domain: "demo",
            status: "open",
            specificity: 0.8,
          }),
        });
        setLog((prev) => [...prev, `Claim created: ${claim.title}`]);
        sessionStorage.setItem("aps-demo-claim", claim.id);
      } else if (index === 1) {
        const claimId = sessionStorage.getItem("aps-demo-claim");
        if (!claimId) throw new Error("missing_claim");
        const att = await api<{ id: string; toolName: string }>(
          "/api/attestations",
          {
            method: "POST",
            body: JSON.stringify({
              claimId,
              toolKind: "calc",
              toolName: "demo_calc_tool",
              status: "bound",
              coverage: 0.85,
              freshness: 0.9,
            }),
          },
        );
        setLog((prev) => [...prev, `Attestation bound: ${att.toolName}`]);
      } else if (index === 2) {
        const claimId = sessionStorage.getItem("aps-demo-claim");
        if (!claimId) throw new Error("missing_claim");
        const proof = await api<{ id: string; name: string }>("/api/proofs", {
          method: "POST",
          body: JSON.stringify({
            claimId,
            name: "Demo soft-sim chain",
            integrity: 0.8,
            status: "draft",
          }),
        });
        await api("/api/kernel", {
          method: "POST",
          body: JSON.stringify({
            proofId: proof.id,
            ruleLabel: "tool_attest_intro",
            conclusion: "Demo tool bound to claim",
            softSimOk: true,
          }),
        });
        sessionStorage.setItem("aps-demo-proof", proof.id);
        setLog((prev) => [...prev, `Proof + kernel step: ${proof.name}`]);
      } else if (index === 3) {
        const claimId = sessionStorage.getItem("aps-demo-claim");
        const proofId = sessionStorage.getItem("aps-demo-proof") ?? undefined;
        if (!claimId) throw new Error("missing_claim");
        const cmp = await api<{
          winner: string;
          attested: { overall: number };
          fluent: { overall: number };
        }>("/api/compare", {
          method: "POST",
          body: JSON.stringify({
            name: "Guided demo compare",
            claimId,
            proofId,
          }),
        });
        setLog((prev) => [
          ...prev,
          `Compare winner ${cmp.winner} (A ${cmp.attested.overall} vs B ${cmp.fluent.overall})`,
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
                  ? "rounded-lg border-2 border-[var(--studio-teal)] bg-[var(--studio-panel)] p-4"
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
