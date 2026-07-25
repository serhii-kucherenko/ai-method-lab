import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export type NamedFlow = {
  id: string;
  name: string;
  actor: string;
  job: string;
  steps: string[];
  success: string;
  emptyError: string;
  href: string;
  cta: string;
};

export const NAMED_FLOWS: NamedFlow[] = [
  {
    id: "first-run",
    name: "First-run onboarding",
    actor: "Safety QA lead",
    job: "Stand up the studio and acknowledge the honesty fence.",
    steps: [
      "/onboarding — open checklist",
      "/settings — confirm org name",
      "Seed demo case (or /cases)",
      "/honesty — acknowledge soft-sim fence",
    ],
    success: "Checklist ≥4/5 with honesty checked; seeded case visible.",
    emptyError: "Seed fails if API unauthorized — use bearer fgs-dev-token.",
    href: "/onboarding",
    cta: "Start onboarding",
  },
  {
    id: "case-gate-boundary",
    name: "Case → gate → boundary → score",
    actor: "Eval engineer",
    job: "Register a fail case through taxonomy, inspection, and dual score.",
    steps: [
      "/cases — create fail case",
      "/gates — attach gate type + severity",
      "/boundaries — record boundary fit + evidence",
      "/compare — run A vs B",
    ],
    success: "Case + taxonomy + inspection listed; compare ready.",
    emptyError: "Gates empty-state if no cases — create on /cases first.",
    href: "/cases",
    cta: "Open fail cases",
  },
  {
    id: "dual-compare",
    name: "Fail-gate vs correctness-only compare",
    actor: "Release reviewer",
    job: "Falsify whether taxonomy diagnosis beats accuracy-only greenlight.",
    steps: [
      "/cases — pick seeded or new case",
      "/gates + /boundaries — ensure taxonomy + inspection",
      "/compare — run A vs B",
      "Read winner + score bars",
    ],
    success: "Compare row with winner fail_gate | correctness_only | tie.",
    emptyError: "Need case + taxonomy + inspection — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "taxonomy-boundary",
    name: "Taxonomy + boundary review",
    actor: "Safety taxonomist",
    job: "Tune gate type and boundary fit before release review.",
    steps: [
      "/cases — select target case",
      "/gates — create or revise taxonomy",
      "/boundaries — adjust fit / evidence / coherence",
      "/compare — re-run to see diagnosis deltas",
    ],
    success: "Active taxonomy + inspection; compare reflects boundary scores.",
    emptyError: "Inspections empty until case + taxonomy exist.",
    href: "/gates",
    cta: "Review gates",
  },
  {
    id: "audit-export",
    name: "Audit + export",
    actor: "Compliance reviewer",
    job: "Export cases JSON / compares CSV and review audits.",
    steps: [
      "/settings — open exports",
      "Download cases JSON",
      "Download compares CSV",
      "Scan audit trail",
    ],
    success: "Files downloaded; audits show compare/export actions.",
    emptyError: "Empty export if no compares — run /compare first.",
    href: "/settings",
    cta: "Open settings",
  },
  {
    id: "pack-scoreboard",
    name: "Pack + scoreboard",
    actor: "Bench admin",
    job: "Version a private pack and rank compares on the scoreboard.",
    steps: [
      "/packs — create or version pack",
      "/cases — attach cases to pack",
      "/compare — run release compares",
      "/scoreboard — rank by fail-gate overall",
    ],
    success: "Pack listed; scoreboard shows ranked compares.",
    emptyError: "Scoreboard empty until compares exist.",
    href: "/packs",
    cta: "Open packs",
  },
  {
    id: "pricing-tier",
    name: "Pricing-tier selection",
    actor: "Buyer",
    job: "Pick Bench / Team / Pack license packaging.",
    steps: [
      "/pricing — review tiers",
      "Note method-lab honesty (no live checkout)",
      "/onboarding — continue setup",
    ],
    success: "Tier understood; buyer proceeds to onboarding.",
    emptyError: "N/A — static tiers always visible.",
    href: "/pricing",
    cta: "See pricing",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named release-gate journeys — each with actor, job, success, and empty/error paths."
    >
      <div className="grid gap-5">
        {NAMED_FLOWS.map((f) => (
          <article
            key={f.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
              {f.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{f.actor}</span> — {f.job}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {f.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm text-slate-600">
              <strong>Success:</strong> {f.success}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              <strong>Empty/error:</strong> {f.emptyError}
            </p>
            <Button asChild className="mt-4 bg-[var(--studio-signal)] hover:bg-[var(--studio-signal-deep)]">
              <Link href={f.href}>{f.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
