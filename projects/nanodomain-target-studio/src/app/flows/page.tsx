import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create therapy pack",
    actor: "Precision-therapy analytics lead",
    job: "Version a soft-sim pack before scoring nanodomain options.",
    steps: "/packs → label + version + therapy focus → active pack",
    success: "Pack appears in registry with version and focus.",
    failure: "Empty label rejected; archived packs stay searchable.",
    href: "/packs",
  },
  {
    name: "Configure nanodomain",
    actor: "Cardio discovery scientist",
    job: "Make cAMP/PKA locus localization and diastolic floors explicit.",
    steps: "/nanodomains → kind + locus + floors → active nanodomain",
    success: "Nanodomain listed with locus hint and floors.",
    failure: "Missing pack id returns bad_pack.",
    href: "/nanodomains",
  },
  {
    name: "Configure peptide pry",
    actor: "Cardio discovery scientist",
    job: "Set PDE pry and systolic preservation floors.",
    steps: "/peptides → kind + pry hint + floors → active peptide",
    success: "Peptide listed with pry and systolic floors.",
    failure: "Bad pack reference blocked.",
    href: "/peptides",
  },
  {
    name: "Run A/B compare",
    actor: "Analytics lead",
    job: "Compare localized nanodomain target vs systemic phosphorylation baseline.",
    steps: "/assays → /compare → dual scores → /scoreboard",
    success: "Winner + gap recorded; scoreboard ranks localized overall.",
    failure: "Missing assay/nanodomain/peptide refs return bad_refs.",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner / reviewer",
    job: "Export packs/compares and ingest an HMAC webhook event.",
    steps: "/settings → export JSON/CSV → test webhook → audit trail",
    success: "Export downloads; webhook idempotent; audit shows ingest.",
    failure: "Bad signature rejected; duplicate key returns duplicate.",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for localized cardio nanodomain soft-sim."
    >
      <div className="space-y-6">
        {FLOWS.map((flow) => (
          <article key={flow.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--nt-crimson)]">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm">
              <strong>Actor:</strong> {flow.actor}
            </p>
            <p className="mt-1 text-sm">
              <strong>Job:</strong> {flow.job}
            </p>
            <p className="mt-1 text-sm">
              <strong>Steps:</strong> {flow.steps}
            </p>
            <p className="mt-1 text-sm">
              <strong>Success:</strong> {flow.success}
            </p>
            <p className="mt-1 text-sm">
              <strong>Failure / empty:</strong> {flow.failure}
            </p>
            <p className="mt-3">
              <Link href={flow.href} className="underline text-[var(--nt-teal)]">
                Enter flow
              </Link>
            </p>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
