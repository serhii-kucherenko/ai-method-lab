export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--agd-muted)] leading-relaxed">
        AI Governance Desk is a method-lab experiment inspired by paper
        2607.14585 — not a replacement for the authors&apos; survey research or
        OSF materials, and not a government AI regulation product.
      </p>
      <p className="text-[var(--agd-muted)] leading-relaxed">
        Do not treat desk scores as official public policy. Never brand this
        desk as a government AI regulator or EU AI Act product name — those
        labels may appear only in Sources / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--agd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.14585v1">
            https://arxiv.org/abs/2607.14585v1
          </a>
        </li>
        <li>
          Authors&apos; code: none published · OSF pre-registration:{" "}
          <a className="underline" href="https://osf.io/5rz9p/">
            https://osf.io/5rz9p/
          </a>
        </li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--agd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/23-ai-governance-desk-lessons.md"
          >
            docs/guides/23-ai-governance-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
