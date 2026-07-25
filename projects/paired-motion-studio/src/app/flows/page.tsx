import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-capture-pack",
    actor: "Mocap analytics eng lead",
    job: "Version a capture pack before scoring",
    steps: ["/captures → create pack → version + capture focus"],
    success: "Active capture pack listed with session budget",
    emptyError: "Missing label/version blocks create",
    href: "/captures",
  },
  {
    id: "configure-wearer",
    actor: "HMD wearer engineer",
    job: "Configure HMD wearers and ego coverage",
    steps: ["/wearers → select pack → kind → create"],
    success: "Wearers linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/wearers",
  },
  {
    id: "configure-observer",
    actor: "Exo rig engineer",
    job: "Configure exo observers and room baselines",
    steps: ["/observers → select pack → kind → create"],
    success: "Observers linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/observers",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare distributed ego+exo fusion vs ego-only baseline",
    steps: ["/sessions → /runs → /compare → A/B → /scoreboard"],
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
      subtitle="Five sophisticated journeys for paired HMD motion soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--pm-teal)] underline"
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
