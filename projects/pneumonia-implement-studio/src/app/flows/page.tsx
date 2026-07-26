import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create district pack",
    href: "/packs",
    body: "Version a soft-sim pack for childhood pneumonia implementation.",
  },
  {
    name: "Configure CFIR co-design pathway",
    href: "/pathways",
    body: "Set co-design intensity and model hints for primary-care soft-sim.",
  },
  {
    name: "Configure fidelity measures",
    href: "/fidelity",
    body: "Capture caregiver delay, referral, and CHW adherence signals.",
  },
  {
    name: "Run A/B compare",
    href: "/compare",
    body: "Score cfir_codesign_primary_care against status_quo_pathway.",
  },
  {
    name: "Export + webhook",
    href: "/settings",
    body: "Export packs/compares and ingest signed webhook events.",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated flows — packs → pathways → fidelity → compare → export."
    >
      <ol className="space-y-4">
        {FLOWS.map((f, i) => (
          <li key={f.name} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--pi-amber)]">Flow {i + 1}</p>
            <Link
              href={f.href}
              className="font-[family-name:var(--font-display)] text-xl text-[var(--pi-teal)] underline"
            >
              {f.name}
            </Link>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {f.body}
            </p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default FlowsPage;
