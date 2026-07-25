"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  { title: "Open a probe pack", body: "Start from the seed Cooperative Probe Soft-Sim Pack.", href: "/packs" },
  { title: "Review probes & domains", body: "Dual-strand cooperative probe + capture–detect domain split.", href: "/domains" },
  { title: "Check targets + assay run", body: "Wild-type bridge target and soft-sim assay run.", href: "/assays" },
  { title: "Run dual compare", body: "cooperative_multi_domain_probe vs single_domain_melting_baseline.", href: "/compare" },
  { title: "Read honesty", body: "Confirm soft-sim fence before any lock story.", href: "/honesty" },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const res = await api<{ compare: { winner: string; gap: number } }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          packId: "pack-demo",
          probeId: "probe-demo",
          domainId: "domain-demo",
          targetId: "target-demo",
          assayRunId: "assay-demo",
        }),
      });
      setResult(`Winner ${res.compare.winner} · gap ${res.compare.gap}`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  const current = STEPS[step];

  return (
    <StudioShell title="Guided demo" subtitle="Five numbered steps through cooperative multi-domain probe soft-sim.">
      <p className="mb-4 text-sm">Step {step + 1} of {STEPS.length}</p>
      <article className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{current.title}</h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <Link href={current.href} className="mt-3 inline-block text-sm underline text-[var(--pd-teal)]">Open {current.href}</Link>
      </article>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
        <Button type="button" disabled={step >= STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Next</Button>
        <Button type="button" onClick={() => void runCompare()}>Run /api/compare</Button>
      </div>
      {result ? <p className="mt-4 text-sm text-[var(--pd-teal)]">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
