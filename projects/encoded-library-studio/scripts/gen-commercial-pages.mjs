import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
};

w(
  "src/app/demo/page.tsx",
  `"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a library pack",
    body: "Start from the seeded Macrocyclic DELT Soft-Sim Pack — versioned context for soft-sim only.",
    href: "/packs",
  },
  {
    title: "Review libraries and cycles",
    body: "Confirm the DNA-encoded library scaffold and construct–screen cycle rounds.",
    href: "/libraries",
  },
  {
    title: "Check the hit shortlist",
    body: "Inspect precision floors before you score — not clinical candidate nomination.",
    href: "/hits",
  },
  {
    title: "Run A/B compare",
    body: "Score iterative DELT optimize against a single-pass library screen on the seeded assay.",
    href: "/compare",
    action: "compare",
  },
  {
    title: "Read the scoreboard",
    body: "See ranked deltas and keep honesty fences visible before any lock.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const current = STEPS[step];

  const runCompare = async () => {
    try {
      const res = await api<{ compare: { winner: string; gap: number } }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: "Guided demo compare" }),
      });
      setResult(\`Winner \${res.compare.winner} · gap \${res.compare.gap}\`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps a stranger can complete — soft-sim DELT compare path."
    >
      <ol className="mb-8 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={\`rounded-md px-3 py-2 \${i === step ? "bg-[var(--studio-accent-soft)]" : ""}\`}
          >
            <span className="font-medium">
              {i + 1}. {s.title}
            </span>
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
          <Link href={current.href} className="underline text-[var(--el-sea)]">
            Open {current.href}
          </Link>
          {"action" in current && current.action === "compare" ? (
            <Button type="button" onClick={() => void runCompare()}>
              Run compare now
            </Button>
          ) : null}
        </div>
        {result ? <p className="mt-3 text-sm text-[var(--el-sea)]">{result}</p> : null}
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
            disabled={step >= STEPS.length - 1}
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
`,
);

w(
  "src/app/onboarding/page.tsx",
  `"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "packs", label: "Open library packs", href: "/packs" },
  { id: "cycles", label: "Review a construct cycle", href: "/cycles" },
  { id: "hits", label: "Inspect a hit shortlist", href: "/hits" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "settings", label: "Confirm org settings", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / CHECKS.length) * 100),
    [done],
  );

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run DELT soft-sim setup."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div className="score-bar h-full bg-[var(--el-sea)]" style={{ width: \`\${progress}%\` }} />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) => setDone((d) => ({ ...d, [c.id]: e.target.checked }))}
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--el-sea)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
`,
);

w(
  "src/app/flows/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

export const NAMED_FLOWS = [
  {
    name: "Create library pack",
    actor: "DELT chemistry analytics lead",
    job: "Version a soft-sim pack before any compare",
    steps: ["/packs"],
    success: "Active pack appears in the registry",
    failure: "Missing label/version blocks create",
  },
  {
    name: "Configure construct cycle",
    actor: "Assay designer",
    job: "Make construct–screen rounds explicit",
    steps: ["/cycles", "/libraries"],
    success: "Cycle with enrichment floor is active",
    failure: "Bad packId returns empty create",
  },
  {
    name: "Filter hit shortlist",
    actor: "Hit triage analyst",
    job: "Set precision floors without nominating clinical candidates",
    steps: ["/hits"],
    success: "Shortlist saved with filter hints",
    failure: "Archive removes it from active search",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Compare iterative DELT optimize vs single-pass library screen",
    steps: ["/assays", "/compare", "/scoreboard"],
    success: "Winner + gap recorded on scoreboard",
    failure: "Missing assay refs return bad_refs",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export packs/compares and ingest HMAC webhook events",
    steps: ["/settings"],
    success: "JSON/CSV export + idempotent webhook ack",
    failure: "Bad signature rejected; duplicate key returns duplicate",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five named journeys for Encoded Library Studio — not a single happy path."
    >
      <ol className="space-y-6">
        {NAMED_FLOWS.map((f) => (
          <li key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{f.name}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Actor: {f.actor}
            </p>
            <p className="mt-2">{f.job}</p>
            <p className="mt-2 text-sm">
              Steps:{" "}
              {f.steps.map((s, i) => (
                <span key={s}>
                  {i > 0 ? " → " : ""}
                  <Link href={s} className="underline text-[var(--el-sea)]">
                    {s}
                  </Link>
                </span>
              ))}
            </p>
            <p className="mt-2 text-sm">Success: {f.success}</p>
            <p className="mt-1 text-sm">Failure / empty: {f.failure}</p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default FlowsPage;
`,
);

console.log("commercial pages done");
