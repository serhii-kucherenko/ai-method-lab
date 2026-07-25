"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    id: 1,
    title: "Open route packs",
    body: "Confirm the seeded demo pack or create your own on Packs.",
    href: "/packs",
  },
  {
    id: 2,
    title: "Add candidate route",
    body: "Set steps, branching factor, and memory coverage on Routes.",
    href: "/routes",
  },
  {
    id: 3,
    title: "Record search memory",
    body: "Log a tried path hash and outcome on the Memory board.",
    href: "/memory",
  },
  {
    id: 4,
    title: "Run A vs B compare",
    body: "Structured-memory vs naive local — read the winner.",
    href: "/compare",
  },
  {
    id: 5,
    title: "Export for review",
    body: "Download routes JSON or compares CSV from Settings.",
    href: "/settings",
  },
];

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [compareDone, setCompareDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: unknown[] }>("/api/compare")
      .then((d) => setCompareDone(d.items.length > 0))
      .catch((e) => setError(String(e)));
  }, []);

  async function runDemoCompare() {
    setError("");
    try {
      const packs = await api<{ items: { id: string }[] }>("/api/packs");
      const routes = await api<{ items: { id: string }[] }>("/api/routes");
      if (!packs.items[0] || !routes.items[0]) {
        setError("Seed entities missing — open onboarding first.");
        return;
      }
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo route compare",
          packId: packs.items[0].id,
          routeId: routes.items[0].id,
        }),
      });
      setCompareDone(true);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const current = STEPS[step] ?? STEPS[0];

  return (
    <StudioShell
      title="Guided demo"
      subtitle="One showcase path: pack → route → memory → compare → export."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              i === step
                ? "bg-[var(--studio-teal)] text-white"
                : "bg-[var(--studio-teal-soft)] text-slate-800"
            }`}
          >
            {s.id}. {s.title}
          </button>
        ))}
      </div>
      <article className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Step {current.id}: {current.title}
        </h2>
        <p className="mt-3 text-slate-600">{current.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-[var(--studio-teal)]">
            <Link href={current.href}>Open {current.title}</Link>
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="outline" onClick={() => setStep(step + 1)}>
              Next step
            </Button>
          ) : null}
          <Button variant="outline" onClick={runDemoCompare}>
            Run demo compare
          </Button>
        </div>
        {compareDone ? (
          <p className="mt-4 text-sm text-[var(--studio-teal)]">
            Compare recorded — check Scoreboard or Settings export.
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
        ) : null}
      </article>
    </StudioShell>
  );
}
