import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-baseline-pack",
    actor: "EEG analytics lead",
    job: "Version a baseline pack before scoring",
    steps: ["/baselines → create pack → version + cohort target"],
    success: "Active baseline pack listed with channel budget",
    emptyError: "Missing label/version blocks create",
    href: "/baselines",
  },
  {
    id: "configure-patient-enorms",
    actor: "Epilepsy analytics engineer",
    job: "Make channel montages and coverage spans explicit",
    steps: ["/channels → select pack → montage → create"],
    success: "Channel config linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/channels",
  },
  {
    id: "run-seizure-detection",
    actor: "Detection engineer",
    job: "Capture seizure-detection configs and soft-sim runs",
    steps: ["/detections → create → /runs → intensities"],
    success: "Detection marked scored with an active run",
    emptyError: "Missing detection/channel refs fail run create",
    href: "/detections",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare patient-specific E-norms vs population-norm baseline",
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
      subtitle="Five sophisticated journeys for E-norms baseline soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--eb-teal)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
