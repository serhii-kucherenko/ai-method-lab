import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create route pack",
    actor: "Medchem analytics lead",
    job: "Stand up a versioned pack before any route compare",
    steps: ["/packs → create label/version/focus", "Confirm pack appears in search"],
    success: "Active route pack ready for routes",
    failure: "Empty label → validation blocks create",
    href: "/packs",
  },
  {
    name: "Configure photocatalytic catalyst",
    actor: "Catalyst evaluator",
    job: "Make photocatalytic 1,3-aminoarylation explicit",
    steps: ["/catalysts → pick pack", "Choose photocatalytic_aminoaryl kind", "Set model hint"],
    success: "Catalyst row with yield floor seeded",
    failure: "Missing pack id → API 400",
    href: "/catalysts",
  },
  {
    name: "Configure copper-catalyzed assay",
    actor: "Assay operator",
    job: "Capture photo vs copper yield and cyclopropane strain",
    steps: ["/assays → link pack/route/catalyst", "Set photo + copper + strain"],
    success: "Assay run ready for dual compare",
    failure: "Missing route/catalyst → create fails",
    href: "/assays",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "See whether photocatalytic beats copper-catalyzed aminoarylation",
    steps: ["/compare → select entities", "Run A/B", "/scoreboard review"],
    success: "Winner + gap recorded; scoreboard updates",
    failure: "No assay selected → empty compare",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Hand off soft-sim evidence and ingest inbound events",
    steps: ["/settings → export JSON/CSV", "Set webhook URL", "HMAC ingest via /api/webhook"],
    success: "Export bytes + idempotent webhook ack",
    failure: "Bad HMAC → 401/bad_signature",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys — not a single happy path."
    >
      <div className="space-y-4">
        {FLOWS.map((f) => (
          <article key={f.name} className="rounded-lg border bg-white px-5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">
                {f.name}
              </h2>
              <Link href={f.href} className="text-sm underline text-[var(--aa-teal)]">
                Enter
              </Link>
            </div>
            <p className="mt-1 text-sm">
              <span className="font-medium">Actor:</span> {f.actor}
            </p>
            <p className="text-sm">
              <span className="font-medium">Job:</span> {f.job}
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {f.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-[var(--aa-teal)]">Success: {f.success}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Failure: {f.failure}
            </p>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
