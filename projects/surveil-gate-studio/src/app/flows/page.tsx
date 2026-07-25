import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-surveil-pack",
    actor: "Public-health AI governance lead",
    job: "Version a surveillance pack before scoring",
    steps: ["/packs → create pack → version + surveillance focus"],
    success: "Active surveillance pack listed with signal budget",
    emptyError: "Missing label/version blocks create",
    href: "/packs",
  },
  {
    id: "configure-pillar",
    actor: "Governance pillar engineer",
    job: "Configure governance pillars and coverage",
    steps: ["/pillars → select pack → kind → create"],
    success: "Pillars linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/pillars",
  },
  {
    id: "configure-policy",
    actor: "Policy recipe engineer",
    job: "Configure audit recipes and escalation controls",
    steps: ["/policies → select pack → kind → create"],
    success: "Policies linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/policies",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare six-pillar trust vs explainability-only baseline",
    steps: ["/signals → /audits → /compare → A/B → /scoreboard"],
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
      subtitle="Five sophisticated journeys for surveillance-governance soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--sg-teal)] underline"
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
