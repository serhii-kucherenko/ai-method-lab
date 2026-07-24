import { guard, json } from "@/lib/api";
import { createPanel, listPanels, paginate } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listPanels(q), page, pageSize));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    name?: string;
    organism?: string;
    sampleSource?: string;
    accessionTags?: string[];
    sequenceCount?: number;
  };
  if (!body.name?.trim() || !body.organism?.trim() || !body.sampleSource?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const panel = createPanel({
    name: body.name,
    organism: body.organism,
    sampleSource: body.sampleSource,
    accessionTags: body.accessionTags ?? [],
    sequenceCount: body.sequenceCount ?? 1,
  });
  return json(panel, { status: 201 });
}
