import Link from "next/link";
import {
  DISPLAY_NAME,
  LANDING_HEADLINE,
  LANDING_SUPPORT,
} from "@/lib/claim";

export default function Home() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <section className="flex min-h-screen w-full flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="brand-fade max-w-3xl">
          <p
            className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
          >
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl text-xl font-medium leading-snug text-[var(--color-ink)] sm:text-2xl">
            {LANDING_HEADLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)] sm:text-lg">
            {LANDING_SUPPORT}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/commitments"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-[var(--color-accent)] px-5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            >
              Open commitments
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] border border-[var(--color-rule)] bg-transparent px-5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)]"
            >
              See demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
