import { StudioShell } from "@/components/studio-shell";
import Link from "next/link";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Local soft-sim for one baseline pack and dual A/B compares.",
    includes: [
      "Baseline pack registry",
      "Channel + detection workspace",
      "Patient-specific vs population compare",
      "try.html offline demo",
    ],
  },
  {
    name: "Team",
    price: "Hypothetical seats",
    blurb: "Shared org seats for epilepsy analytics leads reviewing packs.",
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
    blurb: "Private baseline packs for a pediatric EEG analytics site.",
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
      subtitle="Hypothetical method-lab packaging — not a live checkout. Soft-sim seats for baseline packs."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <article
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--eb-teal)]">
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
        Soft-sim only. Not clinical diagnostic use, not live EEG control, not
        FDA cleared.{" "}
        <Link href="/honesty" className="text-[var(--eb-teal)] underline">
          Read honesty
        </Link>
        .
      </p>
    </StudioShell>
  );
}
