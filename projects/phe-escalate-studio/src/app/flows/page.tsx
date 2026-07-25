import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-escalate-pack",
    actor: "Public-health emergency / surveillance ops lead",
    job: "Version an escalate pack before scoring",
    steps: ["/escalates → create pack → version + escalate focus"],
    success: "Active escalate pack listed with case budget",
    emptyError: "Missing label/version blocks create",
    href: "/escalates",
  },
  {
    id: "configure-classification-rules",
    actor: "Outbreak classification engineer",
    job: "Configure case velocity / geo / lab classification rules",
    steps: ["/classifications → select pack → channel cues → create"],
    success: "Classification rule linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/classifications",
  },
  {
    id: "set-escalation-thresholds",
    actor: "Escalation evaluator",
    job: "Set escalation thresholds and soft-sim run scores",
    steps: ["/thresholds → create → /runs → capture proxies"],
    success: "Threshold scored and run listed",
    emptyError: "Empty threshold text or missing refs block create",
    href: "/thresholds",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare AI-assisted escalation vs manual triage baseline",
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
      subtitle="Five sophisticated journeys for PHE escalate soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--pe-teal)] underline"
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
