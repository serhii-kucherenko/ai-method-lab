import { StudioShell } from "@/components/studio-shell";
import Link from "next/link";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Local soft-sim for one translate pack and dual A/B compares.",
    includes: [
      "Translate pack registry",
      "Inputs + maps workspace",
      "GAN vs conventional R2 compare",
      "try.html offline demo",
    ],
  },
  {
    name: "Team",
    price: "Hypothetical seats",
    blurb: "Shared org seats for neuroimaging leads reviewing packs.",
    includes: [
      "Members + roles",
      "Audit trail + exports",
      "HMAC webhooks",
      "Scoreboard across compares",
    ],
  },
  {
    name: "Site",
    price: "Hypothetical site license",
    blurb: "Private translate packs for a Parkinson MRI analytics site.",
    includes: [
      "Higher rate limits",
      "Versioned pack archives",
      "Webhook idempotency keys",
      "Soft-sim honesty fence retained",
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging — not a live checkout. Soft-sim seats for translate packs."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <article
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--r2-teal)]">
              {t.name}
            </h2>
            <p className="mt-1 text-sm font-medium">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only. Not clinical diagnostic use, not live PACS write-back, not
        FDA cleared.{" "}
        <Link href="/honesty" className="text-[var(--r2-teal)] underline">
          Read honesty
        </Link>
        .
      </p>
    </StudioShell>
  );
}
