import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-cost-pack",
    actor: "Sustainability lead",
    job: "Version a sovereign AI cost pack before scoring",
    steps: ["/costs → create pack → version + infra target"],
    success: "Active cost pack listed with model budget",
    emptyError: "Missing label/version blocks create",
    href: "/costs",
  },
  {
    id: "configure-wee-model",
    actor: "Infra analyst",
    job: "Make water–energy–emissions factors explicit",
    steps: ["/models → select pack → factors → create"],
    success: "Impact model linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/models",
  },
  {
    id: "run-sovereign-scenario",
    actor: "Public-sector AI lead",
    job: "Capture intensities for a sovereign infra scenario",
    steps: ["/scenarios → create → /runs → intensities"],
    success: "Scenario marked scored with an active run",
    emptyError: "Missing scenario/model refs fail run create",
    href: "/scenarios",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare sovereign W/E/E accounting vs naive cloud baseline",
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
      subtitle="Five sophisticated journeys for sovereign cost soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--sc-teal)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
