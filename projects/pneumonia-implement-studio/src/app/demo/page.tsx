import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Create a district pack",
    href: "/packs",
    body: "Version the childhood pneumonia soft-sim context.",
  },
  {
    n: 2,
    title: "Add a district",
    href: "/districts",
    body: "Map the rural block or PHC cluster under study.",
  },
  {
    n: 3,
    title: "Configure a CFIR pathway",
    href: "/pathways",
    body: "Set co-design intensity floors for primary-care soft-sim.",
  },
  {
    n: 4,
    title: "Record fidelity measures",
    href: "/fidelity",
    body: "Capture caregiver delay and referral completion signals.",
  },
  {
    n: 5,
    title: "Run A/B compare",
    href: "/compare",
    body: "Score CFIR co-design against status-quo pathway.",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from pack to dual compare — soft-sim only."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="row-lift flex gap-4 rounded-lg border bg-white px-4 py-4"
          >
            <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--pi-amber)]">
              {s.n}
            </span>
            <div>
              <Link href={s.href} className="font-semibold text-[var(--pi-teal)] underline">
                {s.title}
              </Link>
              <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
