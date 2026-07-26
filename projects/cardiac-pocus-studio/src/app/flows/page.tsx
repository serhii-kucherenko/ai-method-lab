import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create exam pack",
    href: "/packs",
    body: "Version a soft-sim pack for COPD point-of-care ultrasound.",
  },
  {
    name: "Configure cardiac POCUS pattern",
    href: "/patterns",
    body: "Set cardiac floors and COPD association for pattern soft-sim.",
  },
  {
    name: "Configure detection assay",
    href: "/assays",
    body: "Capture cardiac pattern and lung-baseline assay readouts.",
  },
  {
    name: "Run A/B compare",
    href: "/compare",
    body: "Score cardiac_pocus_copd against lung_ultrasound_baseline.",
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
      subtitle="Five sophisticated flows — packs → patterns → assays → compare → export."
    >
      <ol className="space-y-4">
        {FLOWS.map((f, i) => (
          <li key={f.name} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--cp-amber)]">Flow {i + 1}</p>
            <Link
              href={f.href}
              className="font-[family-name:var(--font-display)] text-xl text-[var(--cp-teal)] underline"
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
