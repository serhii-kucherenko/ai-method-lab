import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-probe-pack",
    name: "Create probe pack",
    actor: "Assay-design eng",
    job: "Version a soft-sim probe pack before domains and targets enroll.",
    steps: ["/packs", "/probes", "/domains"],
    success: "Active pack with assay focus and session budget.",
    emptyError: "Create fails without label/version/assay focus.",
    href: "/packs",
  },
  {
    id: "configure-domain-split",
    name: "Configure domain split",
    actor: "Probe designer",
    job: "Register capture–detect domain layouts with coverage floors.",
    steps: ["/domains", "/packs", "/probes"],
    success: "Active domain linked to a pack with domain count.",
    emptyError: "Domain create fails when pack id is missing.",
    href: "/domains",
  },
  {
    id: "configure-target",
    name: "Configure target sequence",
    actor: "Molecular diagnostics lead",
    job: "Register wild-type and SNP neighbor targets with bridge floors.",
    steps: ["/targets", "/packs", "/assays"],
    success: "Active target sequence with length and bridge floor.",
    emptyError: "Target create fails without pack id/label.",
    href: "/targets",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Assay analytics eng",
    job: "Compare cooperative_multi_domain_probe vs single_domain_melting_baseline.",
    steps: ["/assays", "/probes", "/compare", "/scoreboard"],
    success: "Compare row with winner, gap, and dual scores.",
    emptyError: "Compare fails when pack/probe/domain/target/assay ids mismatch.",
    href: "/compare",
  },
  {
    id: "export-webhook",
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export pack JSON/CSV and verify HMAC webhook ingest.",
    steps: ["/settings", "/scoreboard", "/honesty"],
    success: "Export payload downloaded; webhook ack with idempotency.",
    emptyError: "Webhook rejects bad HMAC signature.",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell title="User flows" subtitle="Five sophisticated journeys for cooperative multi-domain probe soft-sim — not a single happy path.">
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article key={flow.id} className="row-lift rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
                <p className="mt-1 text-sm"><span className="font-medium">Actor:</span> {flow.actor}</p>
                <p className="text-sm"><span className="font-medium">Job:</span> {flow.job}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">Steps: {flow.steps.join(" → ")}</p>
                <p className="text-sm text-[var(--pd-teal)]">Success: {flow.success}</p>
                <p className="text-sm text-[var(--pd-amber)]">Empty/error: {flow.emptyError}</p>
              </div>
              <Link href={flow.href} className="rounded-md bg-[var(--pd-teal)] px-3 py-2 text-sm text-white">Enter flow</Link>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
