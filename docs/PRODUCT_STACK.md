# Product engineering stack (default)

Every new Method Lab product under `projects/<slug>/` uses this stack unless CONTROLLER explicitly overrides.

## Required (product UI)

| Layer | Choice |
|-------|--------|
| Framework | **Next.js** (App Router) |
| Language (app) | **TypeScript** |
| Styling | **Tailwind CSS** |
| UI kit | **shadcn/ui** (Radix base; `npx shadcn@latest init -d --base radix`) |
| Components | Prefer shadcn primitives; compose — do not invent parallel button/input systems |
| Persistence | SQLite (or CONTROLLER `product_defaults.persistence`) |
| Auth | Bearer / session per product needs (CONTROLLER `auth`) |
| Domain tests (TS) | Vitest or Node test runner for pure TypeScript domain math |
| UI tests | Playwright or component critical-path smokes per unlocked page |

## Python (allowed and expected when needed)

Papers often ship **Python** models, notebooks, or CLIs. Using Python is fine — inevitable for faithful ports. Do **not** force a weak TypeScript reimplementation when the paper’s claim needs NumPy/PyTorch/scikit-learn/etc.

| Use Python when | Prefer TypeScript when |
|-----------------|------------------------|
| Authors’ code is Python and the unique claim needs that runtime | Desk CRUD, auth, audit, webhooks, UI |
| Numeric / ML / signal / graph libs are the point of the experiment | Simple dual-impl goldens that stay readable in TS |
| Dual-impl or fixtures are easiest to verify in `pytest` | Pure rule/math desks (tax, billing, lifecycle) |

### Layout

```text
projects/<slug>/
  app/ or src/app/          # Next.js UI
  lib/ or src/              # TS domain + API routes / server actions
  python/                   # optional Python package
    pyproject.toml          # or requirements.txt
    README.md               # how to create venv + run
    <pkg>/                  # importable modules
    tests/                  # pytest
  scripts/
    dev.mjs                 # starts Next + Python together (preferred)
  try.html                  # offline JS demo of the claim (may be approximate)
```

### How to run (local — required in README)

Document **one** happy path that a stranger can copy:

```bash
# 1) App
cd projects/<slug>
npm install
npm run dev          # Next on :3000 (or PORT)

# 2) Python sidecar (when present)
cd python
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -e ".[dev]"   # or: pip install -r requirements.txt
uvicorn <pkg>.api:app --reload --port 8787
```

Preferred: a root script so one command brings both up:

```json
"scripts": {
  "dev": "node scripts/dev.mjs",
  "dev:web": "next dev",
  "dev:py": "cd python && .venv/Scripts/python -m uvicorn <pkg>.api:app --port 8787",
  "test": "vitest run && npm run test:py",
  "test:py": "cd python && .venv/Scripts/python -m pytest -q"
}
```

`scripts/dev.mjs` should spawn Next + uvicorn, forward signals, and print both URLs. On Windows, use the venv’s `python.exe` / `Scripts\uvicorn.exe` explicitly (do not assume `source`).

### How the web app talks to Python

1. **HTTP sidecar (default)** — FastAPI (or Flask) on `127.0.0.1:8787`; Next Route Handlers / server actions call it with a short timeout. Env: `PYTHON_SERVICE_URL=http://127.0.0.1:8787`.
2. **CLI subprocess (narrow)** — `spawn(python, ["-m", "pkg.cmd", ...])` for batch jobs only; never on every keystroke; always capture stderr and exit codes.
3. **Do not** embed a long-lived Python interpreter inside the Next process.

Contract: JSON in/out, versioned path (`/v1/...`), health check `GET /health`. Keep dual-impl goldens callable from both TS tests (via HTTP or shared fixtures) and `pytest`.

### Tests

- TypeScript: lifecycle, CRUD, UI critical paths
- Python: `pytest` for the unique numeric/ML claim (≥25 goldens when that claim lives in Python)
- Integration: at least one test that Next (or a thin TS client) reaches the sidecar happy path when Python is part of the product

### Offline try page + StackBlitz

- `try.html` stays **single-file, no server** — port a **simplified** JS view of the claim, or show honest “approximate demo; full fidelity needs local Python” copy.
- StackBlitz / browser playground often **cannot** run the Python sidecar — README must say: full stack = `npm run dev` locally (Next + venv). Digest email still attaches `try.html` + StackBlitz for the UI shell when useful.

### Docker (optional, not required)

If local venv friction is high, add a `docker compose` with `web` + `python` services. Still keep the venv path documented so agents without Docker can run.

## Scaffold (delivery)

Non-interactive preferred:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
npx shadcn@latest init -d --base radix
```

Then add only the shadcn components the designer’s page map needs (`npx shadcn@latest add …`).

Add `python/` only when the paper claim needs it — do not invent a sidecar for pure TS desks.

## Marketing landing

Every product’s `/` route is a **marketing landing** (hero, problem, product, selling points, features, how-it-works, honesty, Sources) per `protocols/DESIGN.md`. Desk work lives behind the primary CTA (usually `/jobs`).

## Honesty

Stack choice does not waive domain depth, dual-impl goldens, or the ≥15-feature / ≥6-page sustain bar. Pretty UI on a shallow dual-gate clone still fails. Python does not waive the designer note or shadcn UI.

## Config hygiene (no UTF-8 BOM)

Node rejects `package.json` that starts with a UTF-8 BOM (`ERR_INVALID_PACKAGE_CONFIG`). Common cause on Windows: PowerShell `Set-Content -Encoding utf8` (writes BOM).

- Write JSON with Node `fs.writeFileSync(path, data, "utf8")` (no BOM), or PowerShell `utf8NoBOM` / `[IO.File]::WriteAllText`
- After bulk renames: `node scripts/strip-json-bom.mjs`
- Guard: `node scripts/strip-json-bom.mjs --check`

## Skills / docs agents should load

- Vercel Next.js + React best practices skills when implementing UI
- shadcn skill for init/add/composition
- `protocols/DESIGN.md` for visual direction before shipping pages
- Paper authors’ README for Python env pins (torch/CUDA may be mocked or CPU-only in lab desks)
