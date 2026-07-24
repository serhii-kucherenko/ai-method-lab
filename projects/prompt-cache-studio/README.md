# Prompt Cache Studio

**Compress without killing the cache.**

Platform teams paying for LLM APIs use cache-aware prompt compression so shared prefixes stay cacheable while still reducing tokens. Naive query-aware compression rewrites the prefix, busts the cache, and erases two-tier savings.

## Run

```bash
cd projects/prompt-cache-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/deployments`.

## Test

```bash
npm test
npm run test:app-up
```

## Dual score

- **A (cache-aware):** preserve shared prefix for provider cache; compress query/suffix; two-tier cost
- **B (naive-bust):** rewrite whole prompt including prefix; lose cache hits and tier discount

## Honesty

Method-lab soft simulation inspired by [arXiv:2607.15516](https://arxiv.org/abs/2607.15516v1). Not a live Anthropic/OpenAI cache control plane. Authors’ code: none. See `/honesty`.

## Offline demo

Open `try.html` in a browser for a simplified JS demo of the claim.
