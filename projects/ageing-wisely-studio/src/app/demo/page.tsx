"use client";
import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const STEPS = [
  { title: "Open a care pack", body: "Start from Packs and version the older-adult iCBT soft-sim context.", href: "/packs" },
  { title: "Configure a cohort", body: "Set inclusion hints and support floors for the soft-sim cohort.", href: "/cohorts" },
  { title: "Shape the module path", body: "Choose psychoeducation, activation, or restructuring paths.", href: "/modules" },
  { title: "Log a session soft-sim", body: "Capture therapist support fidelity and engagement signals.", href: "/sessions" },
  { title: "Run A/B compare", body: "Score therapist-supported iCBT against waitlist / self-guided.", href: "/compare" },
];

export function DemoPage() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the core care-pack → compare happy path."
    >
      <p className="mb-4 text-sm text-[var(--aw-sage)]">
        Step {step + 1} of {STEPS.length}
      </p>
      <div className="rounded-lg border bg-white p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{current.title}</h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          <Button type="button" disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
          <Link href={current.href} className="rounded-md bg-[var(--aw-sage)] px-3 py-2 text-sm text-white">
            Open step
          </Link>
        </div>
      </div>
    </StudioShell>
  );
}

export default DemoPage;
