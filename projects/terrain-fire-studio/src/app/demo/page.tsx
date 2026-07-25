"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    id: 1,
    title: "Open packs registry",
    body: "Confirm the seeded Ridge Creek pack or create your own.",
    href: "/packs",
  },
  {
    id: 2,
    title: "Review aerial refresh",
    body: "Check capture date, resolution, and cloud cover on Aerials.",
    href: "/aerials",
  },
  {
    id: 3,
    title: "Inspect alignment plan",
    body: "Elevation prior and seam budget drive physics-aware quality.",
    href: "/alignment",
  },
  {
    id: 4,
    title: "Run A vs B compare",
    body: "Physics-aware refresh vs naive overlay — read the winner.",
    href: "/compare",
  },
  {
    id: 5,
    title: "Export for review",
    body: "Download packs JSON or compares CSV from Settings.",
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

  async function runCompare() {
    setError("");
    try {
      const packs = await api<{ items: { id: string }[] }>("/api/packs");
      const aerials = await api<{ items: { id: string }[] }>("/api/aerials");
      const plans = await api<{ items: { id: string }[] }>("/api/alignment");
      if (!packs.items[0] || !aerials.items[0] || !plans.items[0]) {
        setError("Seed entities missing — open onboarding first.");
        return;
      }
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo ridge compare",
          packId: packs.items[0].id,
          aerialId: aerials.items[0].id,
          planId: plans.items[0].id,
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
      subtitle="One showcase path: pack → aerial → align → compare → export."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              i === step
                ? "bg-[var(--studio-ember)] text-white"
                : "bg-[var(--studio-ember-soft)] text-stone-800"
            }`}
          >
            {s.id}. {s.title}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Step {current.id}: {current.title}
        </h2>
        <p className="mt-2 text-stone-600">{current.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href={current.href}>Open {current.title}</Link>
          </Button>
          {current.id === 4 ? (
            <Button variant="outline" onClick={runCompare}>
              Run demo compare here
            </Button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <Button variant="outline" onClick={() => setStep(step + 1)}>
              Next step
            </Button>
          ) : null}
        </div>
        {compareDone ? (
          <p className="mt-4 text-sm text-[var(--studio-ridge)]">
            Compare recorded — open /compare to read A vs B bars.
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>
    </StudioShell>
  );
}
