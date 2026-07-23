export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--pmd-muted)] leading-relaxed">
        Pocket Molecule Desk is a method-lab experiment inspired by paper
        2607.12349 — not a replacement for the authors&apos; ConDitar pipeline
        or commercial structure-based drug design vendors.
      </p>
      <p className="text-[var(--pmd-muted)] leading-relaxed">
        Soft simulation of pocket-conditioned + property-aware molecule plans
        and risk deltas only. Never brand ConDitar / msPRL / paOPT / CDH as the
        product name — those labels may appear only in Sources / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--pmd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.12349v1">
            https://arxiv.org/abs/2607.12349v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--pmd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/27-pocket-molecule-desk-lessons.md"
          >
            docs/guides/27-pocket-molecule-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
