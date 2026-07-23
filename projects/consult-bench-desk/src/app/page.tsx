import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModalityStrip } from "@/components/modality-strip";

const SELLING = [
  "Compare multimodal real-world plans against text-only, image-blind scoring, and synthetic-chat baselines",
  "Keep evaluation plan jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so bench scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / cohort / modality profile catalog",
  "Consult job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (text_only / image_blind / synthetic-chat vs multimodal real-world)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Text+image+rubric plan strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a consult job under a cohort / modality profile",
  "Run scenario compare — text-only, image_blind, and synthetic-chat vs multimodal real-world bands",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--cbd-ink)] sm:text-4xl md:text-5xl">
            Consult Bench Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--cbd-ink)] sm:text-3xl">
            Text + image — real cases — rubric across modalities
          </h1>
          <p className="max-w-xl text-lg text-[var(--cbd-muted)]">
            Real-world multimodal consult evaluation plans with text + image
            evidence and a cross-modal rubric — against text-only scoring,
            image-blind baselines, or synthetic-chat-only benches.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--cbd-steel)] hover:bg-[var(--cbd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <ModalityStrip className="w-full max-w-xl text-[var(--cbd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--cbd-muted)] leading-relaxed">
          Multimodal consult evaluation stalls when text, images, and real cases
          run apart. Text-only plans skip images; image-blind scoring skips
          visual evidence; synthetic-chat-only benches ignore real consult
          context.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          Product
        </h2>
        <p className="text-[var(--cbd-muted)] leading-relaxed">
          Consult Bench Desk scores multimodal real-world plans beside
          naive text-only and image-blind baselines, with jobs,
          audit, and dual-impl goldens. Soft simulation — not a telemedicine consult service and not a claim to replace MedRealMM.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--cbd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--cbd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-[var(--cbd-muted)]">
          {STEPS.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--cbd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--cbd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a telemedicine consult service
          product and not a claim to replace the authors&apos; MedRealMM benchmark.
          Never brand this desk as a telemedicine product.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cbd-ink)]">
          Sources
        </h2>
        <p className="text-sm text-[var(--cbd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.09142v1"
          >
            arXiv:2607.09142
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
