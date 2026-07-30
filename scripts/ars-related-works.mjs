#!/usr/bin/env node
/**
 * Fetch related works via OpenAlex + arXiv (no Anthropic key).
 *
 * Usage:
 *   node scripts/ars-related-works.mjs --title "..." [--doi 10.x] [--arxiv 2607.1] [--limit 12]
 *   node scripts/ars-related-works.mjs --title "..." --out docs/ideas/slug-RELATED-WORKS.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB_ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = {
    title: null,
    doi: null,
    arxiv: null,
    limit: 12,
    out: null,
    json: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--title" && argv[i + 1]) out.title = argv[++i];
    else if (a === "--doi" && argv[i + 1]) out.doi = argv[++i];
    else if (a === "--arxiv" && argv[i + 1]) out.arxiv = String(argv[++i]).replace(/^arXiv:/i, "");
    else if (a === "--limit" && argv[i + 1]) out.limit = Number(argv[++i]);
    else if (a === "--out" && argv[i + 1]) out.out = argv[++i];
    else if (a === "--json") out.json = true;
  }
  return out;
}

function mailto() {
  return process.env.OPENALEX_POLITE_EMAIL || "kucherenko.web@gmail.com";
}

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "ai-method-lab-ars-related-works/1.0",
      ...headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

function normTitle(t) {
  return String(t || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleSim(a, b) {
  const aa = new Set(normTitle(a).split(" ").filter((w) => w.length > 2));
  const bb = new Set(normTitle(b).split(" ").filter((w) => w.length > 2));
  if (!aa.size || !bb.size) return 0;
  let inter = 0;
  for (const w of aa) if (bb.has(w)) inter++;
  return inter / Math.max(aa.size, bb.size);
}

function mapOpenAlex(work) {
  const loc = work.primary_location || {};
  const source = loc.source || {};
  const authors = (work.authorships || [])
    .map((a) => a?.author?.display_name)
    .filter(Boolean)
    .slice(0, 8);
  return {
    id: work.id || null,
    title: work.title || work.display_name || null,
    year: work.publication_year || null,
    doi: work.doi ? String(work.doi).replace(/^https?:\/\/doi\.org\//i, "") : null,
    url: loc.landing_page_url || (work.doi ? `https://doi.org/${String(work.doi).replace(/^https?:\/\/doi\.org\//i, "")}` : null),
    oa_url: loc.pdf_url || work.open_access?.oa_url || null,
    venue: source.display_name || null,
    cited_by: work.cited_by_count ?? null,
    authors,
    source_index: "openalex",
  };
}

async function openAlexByDoi(doi) {
  const url = `https://api.openalex.org/works/doi:${encodeURIComponent(doi)}?mailto=${encodeURIComponent(mailto())}`;
  try {
    return mapOpenAlex(await fetchJson(url));
  } catch {
    return null;
  }
}

async function openAlexSearch(title, perPage) {
  const url =
    `https://api.openalex.org/works?search=${encodeURIComponent(title)}` +
    `&per-page=${perPage}&mailto=${encodeURIComponent(mailto())}`;
  const data = await fetchJson(url);
  return (data.results || []).map(mapOpenAlex);
}

async function openAlexRelated(workId, perPage) {
  if (!workId) return [];
  const id = String(workId).replace("https://openalex.org/", "");
  const url =
    `https://api.openalex.org/works?filter=cited_by:${id}` +
    `&per-page=${Math.min(perPage, 25)}&sort=cited_by_count:desc` +
    `&mailto=${encodeURIComponent(mailto())}`;
  try {
    const data = await fetchJson(url);
    return (data.results || []).map(mapOpenAlex);
  } catch {
    return [];
  }
}

async function arxivSearch(query, maxResults) {
  const url =
    `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}` +
    `&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ai-method-lab-ars-related-works/1.0" },
  });
  if (!res.ok) throw new Error(`arXiv HTTP ${res.status}`);
  return parseArxivXml(await res.text());
}

function parseArxivXml(xml) {
  const entries = [];
  const chunks = xml.split("<entry>").slice(1);
  for (const chunk of chunks) {
    const id = (chunk.match(/<id>([^<]+)<\/id>/) || [])[1] || "";
    const title = ((chunk.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "")
      .replace(/\s+/g, " ")
      .trim();
    const published = (chunk.match(/<published>([^<]+)<\/published>/) || [])[1] || "";
    const summary = ((chunk.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1] || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 400);
    const arxivId = id.replace(/^https?:\/\/arxiv\.org\/abs\//i, "").replace(/v\d+$/i, "");
    entries.push({
      id: arxivId || id,
      title,
      year: published ? Number(published.slice(0, 4)) : null,
      doi: null,
      url: arxivId ? `https://arxiv.org/abs/${arxivId}` : id || null,
      oa_url: arxivId ? `https://arxiv.org/pdf/${arxivId}` : null,
      venue: "arXiv",
      cited_by: null,
      authors: [],
      summary: summary || undefined,
      source_index: "arxiv",
    });
  }
  return entries;
}

async function arxivById(arxivId) {
  const url = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ai-method-lab-ars-related-works/1.0" },
  });
  if (!res.ok) return null;
  const xml = await res.text();
  return parseArxivXml(xml)[0] || null;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const key = (it.doi && `doi:${it.doi.toLowerCase()}`) ||
      (it.url && `url:${it.url.toLowerCase()}`) ||
      `t:${normTitle(it.title)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.title && !args.doi && !args.arxiv) {
    console.error(
      "Usage: node scripts/ars-related-works.mjs --title \"...\" [--doi] [--arxiv] [--limit N] [--out path]",
    );
    process.exit(1);
  }

  const seed = {
    title: args.title,
    doi: args.doi,
    arxiv: args.arxiv,
  };

  let seedRecord = null;
  const related = [];

  if (args.doi) {
    seedRecord = await openAlexByDoi(args.doi);
  }
  if (!seedRecord && args.arxiv) {
    const ax = await arxivById(args.arxiv);
    if (ax) {
      seedRecord = ax;
      seed.title = seed.title || ax.title;
    }
  }
  if (!seedRecord && args.title) {
    const hits = await openAlexSearch(args.title, 5);
    seedRecord = hits.find((h) => titleSim(args.title, h.title) >= 0.45) || hits[0] || null;
  }

  if (seedRecord?.id && String(seedRecord.id).includes("openalex.org")) {
    related.push(...(await openAlexRelated(seedRecord.id, args.limit)));
  }

  const searchTitle = seed.title || seedRecord?.title;
  if (searchTitle) {
    related.push(...(await openAlexSearch(searchTitle, args.limit)));
    // Prefer CS/ML-ish arXiv query when seed looks like LLM/rubric eval
    const arxivQ = /llm|rubric|judge|evaluat/i.test(searchTitle)
      ? `all:${searchTitle.split(/\s+/).slice(0, 6).join(" AND ")}`
      : `ti:"${searchTitle.split(" ").slice(0, 8).join(" ")}"`;
    related.push(...(await arxivSearch(arxivQ, args.limit)));
  }

  let filtered = dedupe(related).filter((r) => {
    if (!seedRecord?.title) return true;
    return titleSim(seedRecord.title, r.title) < 0.92;
  });

  if (seedRecord?.title) {
    filtered = filtered
      .map((r) => ({ ...r, _score: titleSim(seedRecord.title, r.title) * 0.4 + Math.min((r.cited_by || 0) / 500, 0.6) }))
      .sort((a, b) => b._score - a._score)
      .map(({ _score, ...rest }) => rest);
  }

  const payload = {
    generated_at: new Date().toISOString(),
    anthropic_required: false,
    indexes: ["openalex", "arxiv"],
    seed,
    seed_record: seedRecord,
    related: filtered.slice(0, args.limit),
    note: "Ground citations in these records. Do not invent papers.",
  };

  const text = JSON.stringify(payload, null, 2) + "\n";
  if (args.out) {
    const outPath = path.isAbsolute(args.out) ? args.out : path.join(LAB_ROOT, args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, text);
    console.error(`Wrote ${outPath} (${payload.related.length} related)`);
  }

  if (args.json || !args.out) {
    process.stdout.write(text);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
