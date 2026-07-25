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
    actor: "Synthesis-planning lead",
    job: "Stand up the studio and acknowledge the honesty fence.",
    steps: [
      "/onboarding — open checklist",
      "/settings — confirm org name",
      "Seed demo pack (or /packs)",
      "/honesty — acknowledge soft-sim fence",
    ],
    success: "Checklist ≥4/6 with honesty checked; seeded pack visible.",
    emptyError: "Seed fails if API unauthorized — use bearer rrs-dev-token.",
    href: "/onboarding",
    cta: "Start onboarding",
  },
  {
    id: "pack-route-memory",
    name: "Pack → route → memory → score",
    actor: "MedChem planner",
    job: "Register a multi-step route with structured search memory.",
    steps: [
      "/packs — create route pack",
      "/routes — add candidate multi-step route",
      "/memory — record tried path outcome",
      "/compare — run A vs B",
    ],
    success: "Pack + route + memory cell listed; compare ready.",
    emptyError: "Routes empty-state if no packs — create on /packs first.",
    href: "/packs",
    cta: "Open route packs",
  },
  {
    id: "dual-compare",
    name: "Structured-memory vs naive compare",
    actor: "Route pack reviewer",
    job: "Falsify whether memory-aware scores beat greedy local greenlight.",
    steps: [
      "/routes — pick seeded or new route",
      "/memory — ensure tried paths recorded",
      "/compare — run A vs B",
      "Read winner + score bars",
    ],
    success: "Compare row with winner structured_memory | naive_local | tie.",
    emptyError: "Need pack + route — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "intermediate-review",
    name: "Intermediate property review",
    actor: "Process chemist",
    job: "Capture intermediate properties and link them into memory cells.",
    steps: [
      "/intermediates — add MW / logP / availability",
      "/memory — attach intermediate ids",
      "/export via settings — download routes JSON",
    ],
    success: "Intermediates listed; export includes property rows.",
    emptyError: "Intermediates empty until a pack exists.",
    href: "/intermediates",
    cta: "Review intermediates",
  },
  {
    id: "audit-export",
    name: "Audit + export",
    actor: "Compliance reviewer",
    job: "Export routes JSON / compares CSV and review audits.",
    steps: [
      "/settings — open exports",
      "Download routes JSON",
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
    name: "Pack version + scoreboard",
    actor: "Bench admin",
    job: "Version a route pack and rank compares on the scoreboard.",
    steps: [
      "/packs — create or version pack",
      "/routes — attach candidate routes",
      "/compare — run memory vs naive compares",
      "/scoreboard — rank by structured overall",
    ],
    success: "Pack listed; scoreboard shows ranked compares.",
    emptyError: "Scoreboard empty until compares exist.",
    href: "/scoreboard",
    cta: "Open scoreboard",
  },
  {
    id: "pricing-tier",
    name: "Pricing-tier selection",
    actor: "Buyer",
    job: "Pick Solo Planner / Bench Team / Site Packs packaging.",
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
      subtitle="Named chem / synthesis-planning journeys — each with actor, job, success, and empty/error paths."
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
              <span className="font-medium text-slate-700">{f.actor}</span> —{" "}
              {f.job}
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
            <Button
              asChild
              className="mt-4 bg-[var(--studio-teal)] hover:bg-[var(--studio-teal-deep)]"
            >
              <Link href={f.href}>{f.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
