import { guard, json } from "@/lib/api";
import { createMatch, listMatches, type MatchStatus } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const status = (url.searchParams.get("status") as MatchStatus) || undefined;
  const zone = url.searchParams.get("zone") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listMatches(q, page, pageSize, status, zone));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  try {
    return json(createMatch(body), { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
