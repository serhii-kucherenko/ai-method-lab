import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const FLOWS = [
  {
    name: "Create program pack",
    actor: "Program analytics lead",
    job: "Version a Nordic EIV expansion soft-sim pack",
    pages: "/packs → /settings",
    success: "Active pack listed with program focus",
    failure: "Missing label/version blocks create",
    href: "/packs",
  },
  {
    name: "Configure country scenario",
    actor: "Public-health analyst",
    job: "Make country ≥65 coverage and parity floors explicit",
    pages: "/countries → /packs",
    success: "Country row active under a pack",
    failure: "Bad pack id returns error",
    href: "/countries",
  },
  {
    name: "Configure outcome metrics",
    actor: "Health-econ modeler",
    job: "Attach hospitalizations / winter-burden outcomes to pack+country+program",
    pages: "/programs → /outcomes",
    success: "Outcome run with coverage and EIV share",
    failure: "Missing refs reject create",
    href: "/outcomes",
  },
  {
    name: "Run A/B compare",
    actor: "Vaccine-program lead",
    job: "Compare expanded_eiv_program vs current_policy_baseline",
    pages: "/compare → /scoreboard",
    success: "Winner + gap on scoreboard",
    failure: "Empty refs show error; empty board message",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner / reviewer",
    job: "Export packs/compares and ingest idempotent webhook events",
    pages: "/settings → /api/export → /api/webhook",
    success: "JSON/CSV download + audit trail",
    failure: "Missing auth or idempotency key fails",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five named journeys for Enhanced Flu Studio — not a single happy path."
    >
      <div className="space-y-4">
        {FLOWS.map((f) => (
          <article key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ef-teal)]">
              {f.name}
            </h2>
            <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <div>
                <dt className="font-medium">Actor</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.actor}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Job</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.job}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Steps</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.pages}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Success</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.success}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium">Failure / empty</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.failure}
                </dd>
              </div>
            </dl>
            <Button asChild className="mt-4" variant="outline">
              <Link href={f.href}>Start flow</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
