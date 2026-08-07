import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FEATURES,
  FEATURES_HEADING,
  HONESTY_TEASE_BODY,
  HONESTY_TEASE_HEADING,
  HOW_IT_WORKS_HEADING,
  HOW_IT_WORKS_STEPS,
  PRICING_TEASE_BODY,
  PRICING_TEASE_HEADING,
  PROBLEM_BODY,
  PROBLEM_HEADING,
  PRODUCT_BODY,
  PRODUCT_HEADING,
  SELLING_POINTS,
  SELLING_POINTS_HEADING,
  SOURCES_BODY,
  SOURCES_HEADING,
} from "@/lib/claim";
import { SectionHeading } from "@/components/landing/section-heading";

export function BelowFold() {
  return (
    <div className="w-full border-t border-border/60 bg-background">
      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
        <SectionHeading>{PROBLEM_HEADING}</SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {PROBLEM_BODY}
        </p>
      </section>

      <section className="w-full bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-paper))] px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-3xl">
          <SectionHeading>{PRODUCT_HEADING}</SectionHeading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {PRODUCT_BODY}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
        <SectionHeading>{SELLING_POINTS_HEADING}</SectionHeading>
        <ul className="mt-8 space-y-4 border-l-2 border-primary pl-6">
          {SELLING_POINTS.map((point) => (
            <li
              key={point}
              className="text-base leading-relaxed text-foreground sm:text-lg"
            >
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 sm:px-12 lg:grid-cols-[minmax(0,12rem)_1fr] lg:items-start">
        <SectionHeading>{FEATURES_HEADING}</SectionHeading>
        <ol className="space-y-3 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-foreground sm:text-base">
          {FEATURES.map((feature, index) => (
            <li key={feature} className="flex gap-3">
              <span className="text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-[family-name:var(--font-sans)]">{feature}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="w-full border-y border-border/60 px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-3xl">
          <SectionHeading>{HOW_IT_WORKS_HEADING}</SectionHeading>
          <ol className="mt-10 space-y-8">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={step} className="flex gap-5">
                <span
                  aria-hidden
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary font-[family-name:var(--font-mono)] text-sm font-medium text-primary-foreground"
                >
                  {index + 1}
                </span>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
        <SectionHeading>{PRICING_TEASE_HEADING}</SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {PRICING_TEASE_BODY}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
        <SectionHeading>{HONESTY_TEASE_HEADING}</SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {HONESTY_TEASE_BODY}
        </p>
        <p className="mt-6">
          <Link
            href="/honesty"
            className="text-base font-medium text-primary underline-offset-4 hover:underline"
          >
            Read the full honesty fence
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-12">
        <h2 className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {SOURCES_HEADING}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {SOURCES_BODY}
        </p>
      </section>

      <footer className="border-t border-border/60 px-6 py-16 sm:px-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-base text-foreground">
            Ready to see the gap before you renew?
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/commitments">Open commitments</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Honesty</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
