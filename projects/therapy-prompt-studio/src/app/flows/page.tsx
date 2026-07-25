import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-prompt-pack",
    actor: "Mental-health product / LLM safety eng lead",
    job: "Version a prompt pack before scoring",
    steps: ["/prompts → create pack → version + therapy focus"],
    success: "Active prompt pack listed with scenario budget",
    emptyError: "Missing label/version blocks create",
    href: "/prompts",
  },
  {
    id: "configure-scenarios",
    actor: "Safety scenario engineer",
    job: "Configure high-risk psychiatric scenario suites",
    steps: ["/scenarios → select pack → kind → create"],
    success: "Scenario suites linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/scenarios",
  },
  {
    id: "configure-gates",
    actor: "Therapy-safety evaluator",
    job: "Configure structured safety gates and soft-sim run scores",
    steps: ["/gates → create → /runs → capture proxies"],
    success: "Gate scored and run listed",
    emptyError: "Empty architecture or missing refs block create",
    href: "/gates",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare structured therapy-safety gates vs prompt-only safety baseline",
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
      subtitle="Five sophisticated journeys for therapy-prompt soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--tp-teal)] underline"
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
