import { guard, json } from "@/lib/api";
import { createTokenizer, listTokenizers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTokenizers({
      q: url.searchParams.get("q") ?? undefined,
      evalChannel: url.searchParams.get("evalChannel") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const tokenizer = createTokenizer(body);
  return json({ tokenizer }, { status: 201 });
}
