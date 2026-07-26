import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create risk pack",
    actor: "Surveillance analytics lead",
    job: "Version a dengue risk pack before climate compare",
    steps: "/packs → label/version/risk focus → active pack",
    success: "Pack listed and searchable",
    failure: "Missing label or auth → error banner",
    href: "/packs",
  },
  {
    name: "Configure CMIP6 scenario",
    actor: "Climate-health modeller",
    job: "Make SSP horizon and thermal floors explicit",
    steps: "/scenarios → pick pack → SSP kind + horizon → create",
    success: "Scenario row with kind + horizon",
    failure: "Bad pack id → create rejected",
    href: "/scenarios",
  },
  {
    name: "Configure species/population overlay",
    actor: "Vector ecologist / analytics lead",
    job: "Attach niche + population-at-risk soft-sim",
    steps: "/species → /populations → thermal + PAR fields",
    success: "Overlay linked to scenario + species",
    failure: "Missing refs → bad_refs",
    href: "/populations",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "See CMIP6 thermal suitability beat or lose to historical baseline",
    steps: "/compare → select refs → climate bias → scoreboard",
    success: "Winner + gap + dual score bars",
    failure: "Empty selects → cannot run",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner / reviewer",
    job: "Export compares and ingest idempotent webhook events",
    steps: "/scoreboard export → /settings webhook → POST /api/webhook",
    success: "CSV download + audit webhook.ingest",
    failure: "Bad HMAC or missing idempotency key",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for dengue thermal-suitability soft-sim — not a single happy path."
    >
      <div className="space-y-5">
        {FLOWS.map((flow) => (
          <article key={flow.name} className="rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
              <Link href={flow.href} className="text-sm underline text-[var(--ds-teal)]">
                Enter
              </Link>
            </div>
            <p className="mt-2 text-sm">
              <strong>Actor:</strong> {flow.actor}
            </p>
            <p className="text-sm">
              <strong>Job:</strong> {flow.job}
            </p>
            <p className="text-sm">
              <strong>Steps:</strong> {flow.steps}
            </p>
            <p className="text-sm">
              <strong>Success:</strong> {flow.success}
            </p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              <strong>Failure / empty:</strong> {flow.failure}
            </p>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
