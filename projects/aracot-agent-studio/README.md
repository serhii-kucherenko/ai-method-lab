# Aracot Agent Studio

Soft-sim studio for multilingual agent / Arabic NLP leads: version agent packs, capture CoT traces, configure distillations, then compare **Arabic CoT distilled agents** against a **non-distilled multilingual baseline** before locking a pack.

Paper: [Research Square rs-10196257](https://doi.org/10.21203/rs.3.rs-10196257/v1) · authors’ code: none published

## Honesty

Method-lab soft-sim only — **not** production Arabic LLM deployment, **not** live customer chat write-back, **not** the authors’ system.

## Run

```bash
cd projects/aracot-agent-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for a zero-server A/B slider demo.
