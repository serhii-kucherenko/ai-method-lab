import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  { id: "create-pathway-pack", name: "Create pathway pack", actor: "Screening product eng", job: "Version a soft-sim pathway pack before cohorts enroll strata.", steps: ["/packs", "/pathways", "/cohorts"], success: "Active pack with study focus and session budget.", emptyError: "Create fails without label/version/study focus.", href: "/packs" },
  { id: "configure-cohort", name: "Configure cohort", actor: "Program lead", job: "Register multi-strata cohorts with access min/max bounds.", steps: ["/cohorts", "/packs", "/screens"], success: "Active cohort linked to a pack with strata count.", emptyError: "Cohort create fails when pack id is missing.", href: "/cohorts" },
  { id: "configure-equity-gate", name: "Configure equity gate", actor: "Equity analyst", job: "Lock equity gates and screen recipes for access soft-sim.", steps: ["/equity", "/screens", "/pathways"], success: "Open equity gate with lock condition and channel.", emptyError: "Equity gate create fails without label/lock condition.", href: "/equity" },
  { id: "run-ab-compare", name: "Run A/B compare", actor: "Digital screening eng", job: "Compare equity_access_task_sharing vs accuracy_only_classifier.", steps: ["/equity", "/screens", "/compare", "/scoreboard"], success: "Compare row with winner, gap, and dual scores.", emptyError: "Compare fails when equity/cohort/screen/pathway/run ids mismatch.", href: "/compare" },
  { id: "export-webhook", name: "Export + webhook", actor: "Org owner", job: "Export pack JSON/CSV and verify HMAC webhook ingest.", steps: ["/settings", "/scoreboard", "/honesty"], success: "Export payload downloaded; webhook ack with idempotency.", emptyError: "Webhook rejects bad HMAC signature.", href: "/settings" },
] as const;

export function FlowsPage() {
  return (
    <StudioShell title="User flows" subtitle="Five sophisticated journeys for equity-access autism screening soft-sim — not a single happy path.">
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article key={flow.id} className="row-lift rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
                <p className="mt-1 text-sm"><span className="font-medium">Actor:</span> {flow.actor}</p>
                <p className="text-sm"><span className="font-medium">Job:</span> {flow.job}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">Steps: {flow.steps.join(" → ")}</p>
                <p className="text-sm text-[var(--ae-teal)]">Success: {flow.success}</p>
                <p className="text-sm text-[var(--ae-amber)]">Empty/error: {flow.emptyError}</p>
              </div>
              <Link href={flow.href} className="rounded-md bg-[var(--ae-teal)] px-3 py-2 text-sm text-white">Enter flow</Link>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
