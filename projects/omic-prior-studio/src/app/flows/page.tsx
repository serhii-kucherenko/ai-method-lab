import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-omic-pack",
    actor: "Precision-medicine / multi-omics analytics eng lead",
    job: "Version an omic pack before scoring",
    steps: ["/omics → create pack → version + risk focus"],
    success: "Active omic pack listed with trait budget",
    emptyError: "Missing label/version blocks create",
    href: "/omics",
  },
  {
    id: "configure-priors",
    actor: "Statistical priors engineer",
    job: "Configure statistical prior sets",
    steps: ["/priors → select pack → kind → create"],
    success: "Prior sets linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/priors",
  },
  {
    id: "configure-traits",
    actor: "Omic prior evaluator",
    job: "Register trait panels and soft-sim run scores",
    steps: ["/traits → create → /runs → capture proxies"],
    success: "Trait panel scored and run listed",
    emptyError: "Empty panel or missing refs block create",
    href: "/traits",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare priors-informed transformer vs priors-free baseline",
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
      subtitle="Five sophisticated journeys for omic-prior soft-sim — not a single happy path."
    >
      <div className="space-y-4">
        {NAMED_FLOWS.map((f) => (
          <article
            key={f.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">{f.job}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Actor: {f.actor}
            </p>
            <p className="mt-2 text-sm"><strong>Steps:</strong> {f.steps.join(" ")}</p>
            <p className="mt-1 text-sm"><strong>Success:</strong> {f.success}</p>
            <p className="mt-1 text-sm"><strong>Empty / error:</strong> {f.emptyError}</p>
            <Link href={f.href} className="mt-3 inline-block text-sm text-[var(--op-teal)] underline">
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
