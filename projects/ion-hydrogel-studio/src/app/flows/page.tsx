import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export const NAMED_FLOWS = [
  {
    name: "Create gel pack",
    actor: "Materials / soft-matter electrolyte analytics lead",
    job: "Version a hydrogel ion-transport context before comparing designs",
    href: "/packs",
    success: "Active pack appears in the registry with electrolyte focus",
    failure: "Empty label / version returns validation feedback",
  },
  {
    name: "Configure charge regulation",
    actor: "Soft-matter modeler",
    job: "Capture dynamic / pH-responsive charge regulation soft-sim floors",
    href: "/charges",
    success: "Charge spec linked to pack with regulation floor",
    failure: "Missing pack id rejects create",
  },
  {
    name: "Configure salt run",
    actor: "Electrolyte analytics engineer",
    job: "Define salt / ionic-strength mobility floors for the assay",
    href: "/salts",
    success: "Salt run listed with mobility floor",
    failure: "Archive removes active salt from default compare path",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Score dynamic charge regulation vs fixed-charge baseline",
    href: "/compare",
    success: "Winner + gap shown; scoreboard updates",
    failure: "Missing assay refs return bad_refs",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export packs JSON / compares CSV and prove HMAC webhook ingest",
    href: "/settings",
    success: "Export download + signed webhook ack",
    failure: "Bad signature rejected; rate limit returns 429",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for hydrogel ion-transport soft-sim — not a single happy path."
    >
      <ul className="space-y-4">
        {NAMED_FLOWS.map((flow) => (
          <li key={flow.name} className="rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">
                  {flow.name}
                </h2>
                <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  Actor: {flow.actor}
                </p>
                <p className="mt-2 text-sm">{flow.job}</p>
                <p className="mt-2 text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  Success: {flow.success}
                </p>
                <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  Failure: {flow.failure}
                </p>
              </div>
              <Link href={flow.href}>
                <Button type="button">Start</Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default FlowsPage;
