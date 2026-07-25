import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-discover-pack",
    actor: "Chemistry discovery / ML-for-chem lead",
    job: "Version a discover pack before scoring",
    steps: ["/discovers → create pack → version + discovery focus"],
    success: "Active discover pack listed with exemplar budget",
    emptyError: "Missing label/version blocks create",
    href: "/discovers",
  },
  {
    id: "curate-multimodal-exemplars",
    actor: "Chem-ML evaluator",
    job: "Capture multimodal exemplar sets for ChemICL soft-sim",
    steps: ["/exemplars → create → link pack → chemistry channel"],
    success: "Exemplar set open and listed under the pack",
    emptyError: "Empty exemplar text blocks create",
    href: "/exemplars",
  },
  {
    id: "configure-modalities",
    actor: "Multimodal chemistry engineer",
    job: "Make structure/spectrum/scheme channel fidelity explicit",
    steps: ["/modalities → select pack → channel cues → create"],
    success: "Modality config linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/modalities",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare multimodal ChemICL vs text-only ICL baseline",
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

export default function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys for multimodal ChemICL soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--cd-teal)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
