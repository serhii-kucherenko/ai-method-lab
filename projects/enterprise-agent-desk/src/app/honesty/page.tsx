export default function HonestyPage() {
  return (
    <section data-honesty="live" className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Enterprise Agent Desk
      </h1>
      <p className="text-[var(--ead-muted)]">
        A method-lab product for multi-agent ERP coordination experiments —
        inspired by a paper with no published authors&apos; code bundle.
      </p>
      <div className="border-l-4 border-[var(--ead-warn)] bg-[#fff8ef] px-4 py-3 text-[var(--ead-ink)]">
        <strong>Honesty:</strong> This is a method experiment inspired by paper
        2607.17331 — not a replacement for the authors&apos; Agentic ERP system.
        Authors&apos; code: none published with this paper. It is not a live
        ERP automation product.
      </div>
      <p className="text-[var(--ead-muted)]">
        Display name stays <strong>Enterprise Agent Desk</strong>. We never brand
        this desk with the paper project&apos;s short name (Agentic ERP).
      </p>
      <p className="text-sm text-[var(--ead-muted)]">
        Tutor guide:{" "}
        <a
          className="tutor-guide-link text-[var(--ead-teal)] underline-offset-2 hover:underline"
          href="/docs/guides/14-enterprise-agent-desk-lessons.md"
        >
          Enterprise Agent Desk lessons
        </a>
      </p>
      <p className="text-sm">
        <a
          className="text-[var(--ead-teal)] underline-offset-2 hover:underline"
          href="https://arxiv.org/abs/2607.17331v1"
        >
          https://arxiv.org/abs/2607.17331v1
        </a>
      </p>
    </section>
  );
}
