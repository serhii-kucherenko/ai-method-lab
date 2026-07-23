export default function HonestyPage() {
  return (
    <section data-honesty="live" className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Agent Safety Desk
      </h1>
      <p className="text-[var(--asd-muted)]">
        A method-lab product for structural monitoring experiments —
        inspired by a paper with no published authors&apos; code bundle.
      </p>
      <div className="border-l-4 border-[var(--asd-warn)] bg-[#fff8ef] px-4 py-3 text-[var(--asd-ink)]">
        <strong>Honesty:</strong> This is a method experiment inspired by paper
        2607.14570 — not a replacement for the authors&apos; safety monitor system.
        Authors&apos; code: none published with this paper. It is not a live
        agent safety vendor product.
      </div>
      <p className="text-[var(--asd-muted)]">
        Display name stays <strong>Agent Safety Desk</strong>. We never brand
        this desk with the paper project&apos;s short name (IFG).
      </p>
      <p className="text-sm text-[var(--asd-muted)]">
        Safety guide:{" "}
        <a
          className="tutor-guide-link text-[var(--asd-teal)] underline-offset-2 hover:underline"
          href="/docs/guides/13-agent-safety-desk-lessons.md"
        >
          Agent Safety Desk lessons
        </a>
      </p>
      <p className="text-sm">
        <a
          className="text-[var(--asd-teal)] underline-offset-2 hover:underline"
          href="https://arxiv.org/abs/2607.14570v1"
        >
          https://arxiv.org/abs/2607.14570v1
        </a>
      </p>
    </section>
  );
}
