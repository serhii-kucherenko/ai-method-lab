export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--tdd-muted)] leading-relaxed">
        Tactile Data Desk is a method-lab experiment inspired by paper
        2607.14588 — not a replacement for the authors&apos; system and not a
        commercial tactile accessibility product.
      </p>
      <p className="text-[var(--tdd-muted)] leading-relaxed">
        Do not treat desk scores as a hardware accessibility product. Never brand
        this desk as Feelogue, CTDI, or Dot Pad — those names may appear only in
        Sources / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--tdd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.14588v1">
            https://arxiv.org/abs/2607.14588v1
          </a>
        </li>
        <li>Authors&apos; code: https://github.com/accessible-data-vis/feelogue</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--tdd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/22-tactile-data-desk-lessons.md"
          >
            docs/guides/22-tactile-data-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
