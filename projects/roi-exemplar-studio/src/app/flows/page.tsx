import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-exemplar-pack",
    actor: "VLM product lead",
    job: "Version an exemplar pack before scoring",
    steps: ["/exemplars → create pack → version + modality target"],
    success: "Active exemplar pack listed with exemplar budget",
    emptyError: "Missing label/version blocks create",
    href: "/exemplars",
  },
  {
    id: "curate-roi-exemplars",
    actor: "Imaging AI engineer",
    job: "Make ROI cue sets and coverage spans explicit",
    steps: ["/rois → select pack → cues → create"],
    success: "ROI config linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/rois",
  },
  {
    id: "configure-incontext-prompts",
    actor: "Prompt engineer",
    job: "Capture in-context prompts and soft-sim runs",
    steps: ["/prompts → create → /runs → intensities"],
    success: "Prompt marked scored with an active run",
    emptyError: "Missing prompt/ROI refs fail run create",
    href: "/prompts",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare optimized in-context exemplars vs naive baseline",
    steps: ["/compare → select refs → run A/B → /scoreboard"],
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
      subtitle="Five sophisticated journeys for ROI exemplar soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--re-coral)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
