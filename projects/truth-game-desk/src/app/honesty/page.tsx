export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--tgd-muted)] leading-relaxed">
        Truth Game Desk is a method-lab experiment inspired by paper
        2607.08403 — not a replacement for the authors&apos; game-theory multi-agent framework and
        not a hallucination-elimination product. Never brand this desk as a
        hallucination-elimination product.
      </p>
      <p className="text-[var(--tgd-muted)] leading-relaxed">
        Soft simulation of game-theoretic multi-agent truth plans
        versus single-agent, flat majority vote without game structure, and
        confidence-only filters baselines. Display name is Truth Game Desk only.
      </p>
      <ul className="space-y-2 text-[var(--tgd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.08403v1">
            https://arxiv.org/abs/2607.08403v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--tgd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/33-truth-game-desk-lessons.md"
          >
            docs/guides/33-truth-game-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
