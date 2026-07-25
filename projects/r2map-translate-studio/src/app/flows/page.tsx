import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-translate-pack",
    actor: "Neuroimaging analytics lead",
    job: "Version a translate pack before scoring",
    steps: ["/translates → create pack → version + cohort target"],
    success: "Active translate pack listed with input budget",
    emptyError: "Missing label/version blocks create",
    href: "/translates",
  },
  {
    id: "register-t1w-t2w-inputs",
    actor: "Parkinson MRI analytics engineer",
    job: "Make T1W/T2W series and fidelity spans explicit",
    steps: ["/inputs → select pack → sequence cues → create"],
    success: "Input series linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/inputs",
  },
  {
    id: "generate-r2map",
    actor: "Map engineer",
    job: "Capture R2map configs and soft-sim runs",
    steps: ["/maps → create → /runs → fidelities"],
    success: "Map marked scored with an active run",
    emptyError: "Missing map/input refs fail run create",
    href: "/maps",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare GAN R2map translation vs conventional R2 baseline",
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
      subtitle="Five sophisticated journeys for R2map translate soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--r2-teal)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
