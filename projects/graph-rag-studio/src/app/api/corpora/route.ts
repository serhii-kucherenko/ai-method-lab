import { guard, json } from "@/lib/api";
import { createCorpus, listCorpora, paginate } from "@/store";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listCorpora(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    domainTag?: string;
    docCount?: number;
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const corpus = createCorpus({
    name: body.name,
    domainTag: body.domainTag ?? "general",
    docCount: body.docCount ?? 10,
  });
  return json(corpus, { status: 201 });
}
