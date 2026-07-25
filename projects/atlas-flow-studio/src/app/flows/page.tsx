import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-atlas-pack",
    actor: "Neuroimaging / histology analytics eng lead",
    job: "Version an atlas pack before scoring",
    steps: ["/atlases → create pack → version + atlas focus"],
    success: "Active atlas pack listed with region budget",
    emptyError: "Missing label/version blocks create",
    href: "/atlases",
  },
  {
    id: "configure-registration",
    actor: "Registration engineer",
    job: "Configure atlas registration configs",
    steps: ["/registrations → select pack → channel cues → create"],
    success: "Registration linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/registrations",
  },
  {
    id: "configure-quantification",
    actor: "Atlas evaluator",
    job: "Configure region quantification and soft-sim run scores",
    steps: ["/quantifications → create → /runs → capture proxies"],
    success: "Quantification scored and run listed",
    emptyError: "Empty region text or missing refs block create",
    href: "/quantifications",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare integrated atlas workflow vs fragmented multi-tool baseline",
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
      subtitle="Five sophisticated journeys for atlas soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--af-teal)] underline"
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
