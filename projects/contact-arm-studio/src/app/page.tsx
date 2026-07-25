import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
    <section className="hero-fade relative min-h-screen overflow-hidden">
      <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
      <div aria-hidden className="contact-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
        <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--studio-orange)] md:text-7xl">{DISPLAY_NAME}</p>
        <span className="signal-underline" aria-hidden />
        <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">{TAGLINE}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-200">Define where an arm will touch, attach tactile and vision evidence, and compare a contact-centric scorer with a vision-only baseline.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/manipulators" className="rounded-md bg-[var(--studio-orange)] px-5 py-2.5 text-sm font-medium text-white">Open manipulators</Link>
          <Link href="/demo" className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white">See demo</Link>
          <Link href="/pricing" className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white">Pricing</Link>
          <Link href="/onboarding" className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white">Onboarding</Link>
          <Link href="/flows" className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white">All flows</Link>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-[family-name:var(--font-display)] text-3xl">A contact plan is more than a trajectory.</h2>
      <p className="mt-3 max-w-2xl text-slate-600">{CLAIM}</p>
      <div className="mt-10 grid gap-7 md:grid-cols-3">
        <div><h3 className="font-semibold">Manipulator packs</h3><p className="mt-1 text-slate-600">Versioned arm, end-effector, and workspace assumptions.</p></div>
        <div><h3 className="font-semibold">Contact points and plans</h3><p className="mt-1 text-slate-600">Make intended contact explicit before reading sensing evidence.</p></div>
        <div><h3 className="font-semibold">Dual A/B</h3><p className="mt-1 text-slate-600">Test contact-centric tactile+vision scoring against vision-only.</p></div>
      </div>
    </section>
    <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-600">
        <strong className="text-[var(--studio-ink)]">Honesty fence:</strong> method-lab soft-sim only; not a live robot controller, not a safety certification tool, and not the authors&apos; system brand. Source: <a className="text-[var(--studio-orange)] underline" href={PAPER_URL}>arXiv 2607.09218</a>.
      </div>
    </section>
  </div>;
}
