import { guard, json } from "@/lib/api";
import { createAsk, listAsks, paginate } from "@/store";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const corpusId = url.searchParams.get("corpusId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listAsks(corpusId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    corpusId?: string;
    query?: string;
    mode?: "multi_step" | "single_shot";
  };
  if (!body.corpusId || !body.query?.trim()) {
    return json({ error: "corpusId_and_query_required" }, { status: 400 });
  }
  try {
    const session = createAsk({
      corpusId: body.corpusId,
      query: body.query,
      mode: body.mode,
    });
    return json(session, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return json({ error: msg }, { status: 400 });
  }
}
