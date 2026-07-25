import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  { id: "create-feed-pack", name: "Create feed pack", actor: "Civic-tech eng", job: "Version a soft-sim feed pack before badges and topics enroll.", steps: ["/packs", "/feeds", "/badges"], success: "Active pack with study focus and session budget.", emptyError: "Create fails without label/version/study focus.", href: "/packs" },
  { id: "configure-badge", name: "Configure open-minded badge", actor: "T&S lead", job: "Register open-minded badge rules with clarity floors and signal hints.", steps: ["/badges", "/packs", "/topics"], success: "Active badge linked to a pack with signal count.", emptyError: "Badge create fails when pack id is missing.", href: "/badges" },
  { id: "configure-topic", name: "Configure topic thread", actor: "Deliberative media eng", job: "Register cross-cutting topic threads with balance floors.", steps: ["/topics", "/packs", "/runs"], success: "Active topic thread with post count.", emptyError: "Topic create fails without pack id/label.", href: "/topics" },
  { id: "run-ab-compare", name: "Run A/B compare", actor: "Platform dialogue eng", job: "Compare productive_open_minded_design vs engagement_maximizing_baseline.", steps: ["/runs", "/feeds", "/compare", "/scoreboard"], success: "Compare row with winner, gap, and dual scores.", emptyError: "Compare fails when pack/badge/feed/topic/run ids mismatch.", href: "/compare" },
  { id: "export-webhook", name: "Export + webhook", actor: "Org owner", job: "Export pack JSON/CSV and verify HMAC webhook ingest.", steps: ["/settings", "/scoreboard", "/honesty"], success: "Export payload downloaded; webhook ack with idempotency.", emptyError: "Webhook rejects bad HMAC signature.", href: "/settings" },
] as const;

export function FlowsPage() {
  return (
    <StudioShell title="User flows" subtitle="Five sophisticated journeys for productive dialogue feed soft-sim — not a single happy path.">
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article key={flow.id} className="row-lift rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
                <p className="mt-1 text-sm"><span className="font-medium">Actor:</span> {flow.actor}</p>
                <p className="text-sm"><span className="font-medium">Job:</span> {flow.job}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">Steps: {flow.steps.join(" → ")}</p>
                <p className="text-sm text-[var(--dd-teal)]">Success: {flow.success}</p>
                <p className="text-sm text-[var(--dd-amber)]">Empty/error: {flow.emptyError}</p>
              </div>
              <Link href={flow.href} className="rounded-md bg-[var(--dd-teal)] px-3 py-2 text-sm text-white">Enter flow</Link>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
