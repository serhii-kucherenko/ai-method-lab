import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create country pack",
    href: "/packs",
    body: "Version a soft-sim pack for responsible AI governance country scoring.",
  },
  {
    name: "Configure index dimensions",
    href: "/dimensions",
    body: "Set structured floors and evidence for multi-dimension soft-sim.",
  },
  {
    name: "Configure indicators",
    href: "/indicators",
    body: "Capture structured depth and checklist coverage indicator readouts.",
  },
  {
    name: "Run A/B compare",
    href: "/compare",
    body: "Score structured_country_index against naive_commitment_checklist.",
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
      subtitle="Five sophisticated flows — packs → dimensions → indicators → compare → export."
    >
      <ol className="space-y-4">
        {FLOWS.map((f, i) => (
          <li key={f.name} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--ri-amber)]">Flow {i + 1}</p>
            <Link
              href={f.href}
              className="font-[family-name:var(--font-display)] text-xl text-[var(--ri-teal)] underline"
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
