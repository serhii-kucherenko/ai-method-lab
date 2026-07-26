import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create care pack",
    actor: "Care analytics lead",
    job: "Version a soft-sim care pack before cohort work",
    steps: "Landing → Packs → create → confirm in list",
    success: "Active pack with version and care focus",
    failure: "Empty label rejected; archived packs filtered",
    href: "/packs",
  },
  {
    name: "Configure cohort",
    actor: "Delivery analyst",
    job: "Make older-adult inclusion soft-sim explicit",
    steps: "Packs → Cohorts → set floors → save",
    success: "Cohort linked to pack with support floor",
    failure: "Missing pack id returns bad_pack",
    href: "/cohorts",
  },
  {
    name: "Configure module path",
    actor: "Program designer",
    job: "Shape internet CBT module path soft-sim",
    steps: "Modules → path hint → engagement floor → save",
    success: "Module active on the pack",
    failure: "Invalid pack blocks create",
    href: "/modules",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Score therapist-supported iCBT vs waitlist baseline",
    steps: "Sessions → Compare → run → Scoreboard",
    success: "Winner + gap recorded on scoreboard",
    failure: "Missing session refs return bad_refs",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export compares and prove HMAC webhook ingest",
    steps: "Settings → set secret → Export → webhook POST",
    success: "JSON/CSV download + idempotent webhook ack",
    failure: "Bad signature rejected; duplicate key returns 200",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys for therapist-supported older-adult iCBT soft-sim."
    >
      <div className="space-y-4">
        {FLOWS.map((flow) => (
          <article key={flow.name} className="rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
              <Link href={flow.href} className="text-sm underline text-[var(--aw-sage)]">
                Enter
              </Link>
            </div>
            <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <div><dt className="font-medium">Actor</dt><dd>{flow.actor}</dd></div>
              <div><dt className="font-medium">Job</dt><dd>{flow.job}</dd></div>
              <div><dt className="font-medium">Steps</dt><dd>{flow.steps}</dd></div>
              <div><dt className="font-medium">Success</dt><dd>{flow.success}</dd></div>
              <div className="md:col-span-2"><dt className="font-medium">Failure / empty</dt><dd>{flow.failure}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
