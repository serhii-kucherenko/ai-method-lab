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
    actor: "GIS program lead",
    job: "Stand up the studio before the first terrain refresh review.",
    steps: [
      "/onboarding — open checklist",
      "/settings — confirm org name",
      "Seed demo pack (or /packs)",
      "/honesty — acknowledge soft-sim fence",
    ],
    success: "Checklist ≥4/5 with honesty checked; seeded pack visible.",
    emptyError: "Seed fails if API unauthorized — use bearer tfs-dev-token.",
    href: "/onboarding",
    cta: "Start onboarding",
  },
  {
    id: "pack-aerial-align",
    name: "Pack → aerial → align → score",
    actor: "Terrain engineer",
    job: "Register a terrain pack, attach an aerial, and author an alignment plan.",
    steps: [
      "/packs — create versioned pack",
      "/aerials — add capture refresh",
      "/alignment — set control density + seam budget",
      "/compare — ready when plan exists",
    ],
    success: "Pack + aerial + active plan listed; ready for dual compare.",
    emptyError: "Aerials empty-state if no packs — create on /packs first.",
    href: "/packs",
    cta: "Open packs",
  },
  {
    id: "dual-compare",
    name: "Physics-aware vs naive overlay compare",
    actor: "Fire-planning reviewer",
    job: "Falsify whether alignment-before-trust beats photo-on-DEM drape.",
    steps: [
      "/packs — pick seeded or new pack",
      "/aerials + /alignment — ensure aerial + plan",
      "/compare — run A vs B",
      "Read winner + score bars",
    ],
    success: "Compare row with winner physics_aware | naive_overlay | tie.",
    emptyError: "Need pack + aerial + plan — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "alignment-review",
    name: "Alignment plan review",
    actor: "Alignment engineer",
    job: "Tune control density, elevation prior, and seam budget for steep ground.",
    steps: [
      "/packs — select target pack",
      "/alignment — create elevation_first or tight_control plan",
      "/compare — re-run to see elevationFidelity / seamContinuity",
      "/honesty — confirm soft-sim limits",
    ],
    success: "Active plan on pack; compare reflects seam and elevation scores.",
    emptyError: "Plans empty until pack + aerial exist.",
    href: "/alignment",
    cta: "Review alignment",
  },
  {
    id: "audit-export",
    name: "Audit + export for reviewer",
    actor: "Compliance / GIS reviewer",
    job: "Export packs JSON and compares CSV with audit trail for review.",
    steps: [
      "/settings — open exports",
      "Download packs JSON",
      "Download compares CSV",
      "Scan audit list",
    ],
    success: "Files download; audits show pack.create / compare.run.",
    emptyError: "Empty CSV if no compares yet — run /compare first.",
    href: "/settings",
    cta: "Open settings",
  },
  {
    id: "org-invite",
    name: "Invite / org settings",
    actor: "Org owner",
    job: "Invite a planner and save org webhook settings.",
    steps: [
      "/settings — edit org name",
      "Invite planner member",
      "Save webhook URL / secret",
      "/onboarding — mark org step done",
    ],
    success: "Member listed; org name persisted.",
    emptyError: "401 if bearer missing — use tfs-dev-token.",
    href: "/settings",
    cta: "Manage org",
  },
  {
    id: "pricing-tier",
    name: "Pricing-tier selection",
    actor: "Buyer / agency lead",
    job: "Pick Pilot, Agency, or Site license against seats + refresh compute.",
    steps: [
      "/pricing — read tiers",
      "Pick Agency for multi-pack refreshes",
      "/onboarding — continue setup",
      "/honesty — note no live checkout",
    ],
    success: "Buyer knows which tier matches pack volume; no fake card charge.",
    emptyError: "N/A — static tiers with method-lab honesty.",
    href: "/pricing",
    cta: "View pricing",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Seven named journeys — not one happy path. Each has actor, job, steps, success, and empty/error."
    >
      <div className="grid gap-6">
        {NAMED_FLOWS.map((flow) => (
          <article
            key={flow.id}
            className="pack-rise rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--studio-ember)]">
              {flow.name}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Actor: {flow.actor}
            </p>
            <p className="mt-2 text-stone-700">{flow.job}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-600">
              {flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm">
              <span className="font-medium">Success:</span> {flow.success}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              <span className="font-medium text-stone-700">Empty/error:</span>{" "}
              {flow.emptyError}
            </p>
            <Button asChild className="mt-4">
              <Link href={flow.href}>{flow.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
