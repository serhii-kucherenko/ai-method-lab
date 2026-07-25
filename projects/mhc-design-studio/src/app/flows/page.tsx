import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-peptide-pack",
    actor: "Immuno design analytics eng lead",
    job: "Version a peptide pack before scoring",
    steps: ["/peptides → create pack → version + design focus"],
    success: "Active peptide pack listed with allele budget",
    emptyError: "Missing label/version blocks create",
    href: "/peptides",
  },
  {
    id: "configure-allele",
    actor: "MHC panel engineer",
    job: "Configure MHC allele panels",
    steps: ["/alleles → select pack → kind → create"],
    success: "Alleles linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/alleles",
  },
  {
    id: "configure-design",
    actor: "Design recipe evaluator",
    job: "Register design recipes and soft-sim run scores",
    steps: ["/designs → create → /runs → capture proxies"],
    success: "Design scored and run listed",
    emptyError: "Empty recipe or missing refs block create",
    href: "/designs",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare hybrid quantum–classical de novo vs classical generative baseline",
    steps: ["/runs → scores → /compare → A/B → /scoreboard"],
    success: "Winner + gap recorded; scoreboard updates",
    emptyError: "Empty refs show invalid_refs",
    href: "/compare",
  },
  {
    id: "export-webhook",
    actor: "Org owner",
    job: "Export packs and wire HMAC webhook for scored events",
    steps: ["/settings → export JSON/CSV → webhook secret → invite member"],
    success: "Export bytes returned; member invited; audit logged",
    emptyError: "Bad bearer or HMAC rejected",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys for MHC peptide design soft-sim — not a single happy path."
    >
      <div className="space-y-4">
        {NAMED_FLOWS.map((f) => (
          <article
            key={f.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {f.job}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Actor: {f.actor}
            </p>
            <p className="mt-2 text-sm">
              <strong>Steps:</strong> {f.steps.join(" ")}
            </p>
            <p className="mt-1 text-sm">
              <strong>Success:</strong> {f.success}
            </p>
            <p className="mt-1 text-sm">
              <strong>Empty / error:</strong> {f.emptyError}
            </p>
            <Link
              href={f.href}
              className="mt-3 inline-block text-sm text-[var(--md-teal)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
