"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a therapy pack",
    body: "Start from the seeded Troponin Nanodomain Soft-Sim Pack.",
    href: "/packs",
  },
  {
    title: "Review nanodomain locus",
    body: "Confirm cAMP/PKA localization and diastolic floors.",
    href: "/nanodomains",
  },
  {
    title: "Review peptide pry",
    body: "Confirm PDE pry strength and systolic preservation.",
    href: "/peptides",
  },
  {
    title: "Run A/B compare",
    body: "Score localized nanodomain target against systemic phosphorylation baseline.",
    href: "/compare",
    action: "compare",
  },
  {
    title: "Check scoreboard + honesty",
    body: "Rank soft-sim deltas, then read the honesty fence before any lock talk.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const current = STEPS[step];

  const runCompare = async () => {
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: "Guided demo compare" }),
      });
      setMsg("Compare ran — check scoreboard next.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from therapy pack to localized vs systemic compare."
    >
      <ol className="mb-8 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={
              i === step
                ? "font-semibold text-[var(--nt-crimson)]"
                : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]"
            }
          >
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>
      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Step {step + 1}: {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {current.body}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={current.href} className="rounded-md border px-3 py-2 text-sm">
            Open {current.href}
          </Link>
          {"action" in current && current.action === "compare" ? (
            <Button type="button" onClick={() => void runCompare()}>
              Run compare now
            </Button>
          ) : null}
        </div>
        {msg ? <p className="mt-3 text-sm text-[var(--nt-teal)]">{msg}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </StudioShell>
  );
}

export default DemoPage;
