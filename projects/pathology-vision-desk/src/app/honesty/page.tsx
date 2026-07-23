export default function HonestyPage() {
  return (
    <section data-honesty="live" className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Pathology Vision Desk
      </h1>
      <p className="text-[var(--pvd-muted)]">
        A method-lab product for multi-expert pathology scoring experiments —
        inspired by a paper with public code.
      </p>
      <div className="border-l-4 border-[var(--pvd-warn)] bg-[#fff8ef] px-4 py-3 text-[var(--pvd-ink)]">
        <strong>Honesty:</strong> This is a method experiment inspired by paper
        2607.09526 — not a replacement for the authors&apos; model at
        github.com/WonderLandxD/ALICE. It is not a clinical diagnostic tool.
      </div>
      <p className="text-[var(--pvd-muted)]">
        Display name stays <strong>Pathology Vision Desk</strong>. We never brand
        this desk with the paper project&apos;s short name.
      </p>
      <p className="text-sm text-[var(--pvd-muted)]">
        Tutor guide:{" "}
        <a
          className="tutor-guide-link text-[var(--pvd-rose)] underline-offset-2 hover:underline"
          href="/docs/guides/10-pathology-vision-desk-lessons.md"
        >
          Pathology Vision Desk lessons
        </a>
      </p>
      <p className="text-sm">
        <a
          className="text-[var(--pvd-rose)] underline-offset-2 hover:underline"
          href="https://arxiv.org/abs/2607.09526v1"
        >
          https://arxiv.org/abs/2607.09526v1
        </a>
      </p>
    </section>
  );
}
