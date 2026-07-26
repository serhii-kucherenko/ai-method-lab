import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  { n: 1, title: "Open the seed pack", href: "/packs", body: "Inspect the thoracic OLF soft-sim case pack." },
  { n: 2, title: "Review the case", href: "/cases", body: "Confirm T10–T11 OLF level hint and ceilings." },
  { n: 3, title: "Check OSE approach", href: "/approaches", body: "See the one-hole split portal draft." },
  { n: 4, title: "Inspect outcomes", href: "/outcomes", body: "Blood loss and stay soft-sim measures." },
  { n: 5, title: "Run A/B compare", href: "/compare", body: "OSE vs open laminectomy with honesty intact." },
  { n: 6, title: "Read the scoreboard", href: "/scoreboard", body: "Lock only when OSE wins and overclaim risk is low." },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the OSE vs open laminectomy happy path."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--se-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              <Link href={s.href} className="underline decoration-[var(--se-teal)]">
                {s.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
