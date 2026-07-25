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
    actor: "Sim eval lead",
    job: "Stand up the studio and acknowledge the honesty fence.",
    steps: [
      "/onboarding — open checklist",
      "/settings — confirm org name",
      "Seed demo pack (or /packs)",
      "/honesty — acknowledge soft-sim fence",
    ],
    success: "Checklist ≥4/5 with honesty checked; seeded pack visible.",
    emptyError: "Seed fails if API unauthorized — use bearer dhs-dev-token.",
    href: "/onboarding",
    cta: "Start onboarding",
  },
  {
    id: "pack-scene-generator",
    name: "Pack → scene → generator → score",
    actor: "World-model engineer",
    job: "Register a horizon through coarse structure, detail, and dual score.",
    steps: [
      "/packs — create scenario pack",
      "/scenes — author coarse scene structure",
      "/generators — attach detail generator",
      "/compare — run A vs B",
    ],
    success: "Pack + scene + generator listed; compare ready.",
    emptyError: "Scenes empty-state if no packs — create on /packs first.",
    href: "/packs",
    cta: "Open scenario packs",
  },
  {
    id: "dual-compare",
    name: "Hierarchical vs flat compare",
    actor: "Planner pack reviewer",
    job: "Falsify whether hierarchical scores beat flat-rollout greenlight.",
    steps: [
      "/scenes — pick seeded or new scene",
      "/generators — ensure detail generator",
      "/compare — run A vs B",
      "Read winner + score bars",
    ],
    success: "Compare row with winner hierarchical | flat | tie.",
    emptyError: "Need scene + generator — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "coarse-detail",
    name: "Coarse + detail review",
    actor: "Scene taxonomist",
    job: "Tune structure fit and detail fidelity before pack lock.",
    steps: [
      "/scenes — select target scene",
      "/generators — revise fidelity / temporal / texture",
      "/compare — re-run to see hierarchical deltas",
    ],
    success: "Active generator; compare reflects structure + detail scores.",
    emptyError: "Generators empty until a scene exists.",
    href: "/scenes",
    cta: "Review scenes",
  },
  {
    id: "audit-export",
    name: "Audit + export",
    actor: "Compliance reviewer",
    job: "Export scenes JSON / compares CSV and review audits.",
    steps: [
      "/settings — open exports",
      "Download scenes JSON",
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
    job: "Version a scenario pack and rank compares on the scoreboard.",
    steps: [
      "/packs — create or version pack",
      "/scenes — attach scenes to pack",
      "/compare — run horizon compares",
      "/scoreboard — rank by hierarchical overall",
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
      subtitle="Named AV sim / world-model eval journeys — each with actor, job, success, and empty/error paths."
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
