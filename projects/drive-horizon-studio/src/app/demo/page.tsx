"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    id: 1,
    title: "Open scenario packs",
    body: "Confirm the seeded demo pack or create your own on Packs.",
    href: "/packs",
  },
  {
    id: 2,
    title: "Author coarse scene",
    body: "Set corridor, structure hash, and horizon steps on Scenes.",
    href: "/scenes",
  },
  {
    id: 3,
    title: "Attach detail generator",
    body: "Record fidelity, temporal consistency, and texture richness.",
    href: "/generators",
  },
  {
    id: 4,
    title: "Run A vs B compare",
    body: "Hierarchical vs flat world-model — read the winner.",
    href: "/compare",
  },
  {
    id: 5,
    title: "Export for review",
    body: "Download scenes JSON or compares CSV from Settings.",
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
      const scenes = await api<{ items: { id: string }[] }>("/api/scenes");
      const generators = await api<{ items: { id: string }[] }>(
        "/api/generators",
      );
      if (!scenes.items[0] || !generators.items[0]) {
        setError("Seed entities missing — open onboarding first.");
        return;
      }
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo horizon compare",
          sceneId: scenes.items[0].id,
          generatorId: generators.items[0].id,
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
      subtitle="One showcase path: pack → scene → generator → compare → export."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              i === step
                ? "bg-[var(--studio-signal)] text-white"
                : "bg-[var(--studio-signal-soft)] text-slate-800"
            }`}
          >
            {s.id}. {s.title}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Step {current.id}: {current.title}
        </h2>
        <p className="mt-2 text-slate-600">{current.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={current.href}>Open page</Link>
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              className="bg-[var(--studio-signal)]"
              onClick={() => setStep(step + 1)}
            >
              Next step
            </Button>
          ) : null}
          {step === 3 ? (
            <Button className="bg-[var(--studio-teal)]" onClick={runDemoCompare}>
              Run demo compare
            </Button>
          ) : null}
        </div>
        {compareDone ? (
          <p className="mt-4 text-sm text-[var(--studio-teal)]">
            Compare recorded — check /compare or /scoreboard.
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p> : null}
      </div>
    </StudioShell>
  );
}
