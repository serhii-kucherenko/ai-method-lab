export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--esd-muted)] leading-relaxed">
        Evidence Synthesis Desk is a method-lab experiment inspired by paper
        2607.15247 — not a replacement for the authors&apos; system and not a
        commercial evidence-synthesis vendor.
      </p>
      <p className="text-[var(--esd-muted)] leading-relaxed">
        Do not treat desk scores as clinical or regulatory evidence. Never brand
        this desk as AutoSynthesis. PRISMA may appear only in Sources / honesty
        copy — never as the product name.
      </p>
      <ul className="space-y-2 text-[var(--esd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.15247v1">
            https://arxiv.org/abs/2607.15247v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--esd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/21-evidence-synthesis-desk-lessons.md"
          >
            docs/guides/21-evidence-synthesis-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
