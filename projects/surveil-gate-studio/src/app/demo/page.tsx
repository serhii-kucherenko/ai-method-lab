"use client";
import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export const STEPS = [
  "Create a versioned surveillance pack.",
  "Attach governance pillars with coverage assumptions.",
  "Configure a policy recipe and escalation controls.",
  "Open a signal batch and run soft-sim audit proxies.",
  "Compare six-pillar trust against explainability-only.",
] as const;

export function DemoPage() {
  const [index, setIndex] = useState(0);
  const last = index === STEPS.length - 1;
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the complete surveillance-governance soft-sim loop."
    >
      <div className="max-w-2xl rounded-lg border bg-white p-7">
        <p className="text-sm text-[var(--sg-teal)]">
          Step {index + 1} of {STEPS.length}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl">
          {STEPS[index]}
        </h2>
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            disabled={!index}
            onClick={() => setIndex(index - 1)}
          >
            Back
          </Button>
          {last ? (
            <Button asChild>
              <Link href="/compare">Open compare</Link>
            </Button>
          ) : (
            <Button onClick={() => setIndex(index + 1)}>Next</Button>
          )}
        </div>
      </div>
    </StudioShell>
  );
}

export default DemoPage;
