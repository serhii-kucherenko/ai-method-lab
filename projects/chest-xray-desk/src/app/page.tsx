import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RegionStrip } from "@/components/region-strip";

const SELLING = [
  "Compare classify→localize→validate plans against classification-only, localization without clinical gate, and threshold-alert baselines",
  "Keep detection plan jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so plan scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / site / protocol profile catalog",
  "Study job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (classify_only / localize_no_gate / threshold-alert vs classify→localize→validate)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Label+region+validate plan strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a study job under a site / protocol profile",
  "Run scenario compare — classification-only, localize_no_gate, and threshold-alert vs classify→localize→validate bands",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--cxd-ink)] sm:text-4xl md:text-5xl">
            Chest Xray Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--cxd-ink)] sm:text-3xl">
            Classify labels — localize regions — validate clinically
          </h1>
          <p className="max-w-xl text-lg text-[var(--cxd-muted)]">
            Classify to localize to clinically validate chest radiograph plans with labels linked
            and clinical validation across sites — against classification-only,
            localization without clinical gate, or unverified single-threshold alerts baselines.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--cxd-steel)] hover:bg-[var(--cxd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <RegionStrip className="w-full max-w-xl text-[var(--cxd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--cxd-muted)] leading-relaxed">
          Chest X-ray detection stalls when labels, regions, and clinical
          validation run apart. Classification-only plans skip regions;
          localization without a clinical gate skips validation; unverified
          single-threshold alerts ignore real-world checks.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          Product
        </h2>
        <p className="text-[var(--cxd-muted)] leading-relaxed">
          Chest Xray Desk scores classify→localize→validate plans beside
          naive classification-only and localize-no-gate baselines, with jobs,
          audit, and dual-impl goldens. Soft simulation — not a clinical
          diagnostic and not a medical device.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--cxd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--cxd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-[var(--cxd-muted)]">
          {STEPS.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--cxd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--cxd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a clinical diagnostic
          product and not a claim to replace the authors&apos; Thailand deep learning system.
          Never brand this desk as a medical device.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cxd-ink)]">
          Sources
        </h2>
        <p className="text-sm text-[var(--cxd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.09305v1"
          >
            arXiv:2607.09305
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
