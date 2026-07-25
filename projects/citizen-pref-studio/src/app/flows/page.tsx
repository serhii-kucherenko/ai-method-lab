import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  { id: "create-policy-pack", name: "Create policy pack", actor: "AI policy eng", job: "Version a soft-sim policy pack before options and countries enroll.", steps: ["/packs", "/options", "/countries"], success: "Active pack with study focus and session budget.", emptyError: "Create fails without label/version/study focus.", href: "/packs" },
  { id: "configure-options", name: "Configure regulatory options", actor: "Governance lead", job: "Register regulatory options with safety floors and oversight hints.", steps: ["/options", "/packs", "/surveys"], success: "Active option linked to a pack with attribute count.", emptyError: "Option create fails when pack id is missing.", href: "/options" },
  { id: "configure-country", name: "Configure country cohort", actor: "Preference analyst", job: "Register multi-country cohorts with preference min/max bounds.", steps: ["/countries", "/packs", "/prefs"], success: "Active country cohort with strata count.", emptyError: "Country create fails without pack id/label.", href: "/countries" },
  { id: "run-ab-compare", name: "Run A/B compare", actor: "Product governance eng", job: "Compare safety_first_public_oversight vs innovation_first_self_regulation.", steps: ["/prefs", "/surveys", "/compare", "/scoreboard"], success: "Compare row with winner, gap, and dual scores.", emptyError: "Compare fails when pack/option/country/survey/run ids mismatch.", href: "/compare" },
  { id: "export-webhook", name: "Export + webhook", actor: "Org owner", job: "Export pack JSON/CSV and verify HMAC webhook ingest.", steps: ["/settings", "/scoreboard", "/honesty"], success: "Export payload downloaded; webhook ack with idempotency.", emptyError: "Webhook rejects bad HMAC signature.", href: "/settings" },
] as const;

export function FlowsPage() {
  return (
    <StudioShell title="User flows" subtitle="Five sophisticated journeys for citizen preference / regulatory option soft-sim — not a single happy path.">
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article key={flow.id} className="row-lift rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
                <p className="mt-1 text-sm"><span className="font-medium">Actor:</span> {flow.actor}</p>
                <p className="text-sm"><span className="font-medium">Job:</span> {flow.job}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">Steps: {flow.steps.join(" → ")}</p>
                <p className="text-sm text-[var(--cp-teal)]">Success: {flow.success}</p>
                <p className="text-sm text-[var(--cp-amber)]">Empty/error: {flow.emptyError}</p>
              </div>
              <Link href={flow.href} className="rounded-md bg-[var(--cp-teal)] px-3 py-2 text-sm text-white">Enter flow</Link>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
