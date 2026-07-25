import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-exam-pack",
    name: "Create exam pack",
    actor: "Study ops lead",
    job: "Version a soft-sim exam pack before sites enroll video captures.",
    steps: ["/packs", "/sites", "/protocols"],
    success: "Active pack with study focus and session budget.",
    emptyError: "Create fails without label/version/study focus.",
    href: "/packs",
  },
  {
    id: "configure-site",
    name: "Configure study site",
    actor: "Site coordinator",
    job: "Register multi-center sites with consistency bounds.",
    steps: ["/sites", "/packs", "/exams"],
    success: "Active site linked to a pack with examiner count.",
    emptyError: "Site create fails when pack id is missing.",
    href: "/sites",
  },
  {
    id: "configure-protocol",
    name: "Configure async protocol",
    actor: "Neurology protocol designer",
    job: "Lock protocol steps for standardized async video exams.",
    steps: ["/protocols", "/videos", "/exams"],
    success: "Active protocol with fidelity hint and step count.",
    emptyError: "Protocol create fails without pack linkage.",
    href: "/protocols",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Trial analytics eng",
    job: "Compare standardized async video exam vs ad-hoc baseline.",
    steps: ["/videos", "/exams", "/compare", "/scoreboard"],
    success: "Compare row with winner, gap, and dual scores.",
    emptyError: "Compare fails when video/site/protocol/exam ids mismatch.",
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
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for multi-site async neuro exam soft-sim — not a single happy path."
    >
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article
            key={flow.id}
            className="row-lift rounded-lg border bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">
                  {flow.name}
                </h2>
                <p className="mt-1 text-sm">
                  <span className="font-medium">Actor:</span> {flow.actor}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Job:</span> {flow.job}
                </p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
                  Steps: {flow.steps.join(" → ")}
                </p>
                <p className="text-sm text-[var(--an-teal)]">
                  Success: {flow.success}
                </p>
                <p className="text-sm text-[var(--an-amber)]">
                  Empty/error: {flow.emptyError}
                </p>
              </div>
              <Link
                href={flow.href}
                className="rounded-md bg-[var(--an-teal)] px-3 py-2 text-sm text-white"
              >
                Enter flow
              </Link>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
