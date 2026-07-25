import { guard, json } from "@/lib/api";
import { archiveFeed, createFeed, listFeeds } from "@/store";
import type { FeedLane } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listFeeds({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const feed = archiveFeed(body.id);
    if (!feed) return json({ error: "not_found" }, { status: 404 });
    return json({ feed });
  }
  const feed = createFeed({
    packId: body.packId,
    label: body.label,
    lane: (body.lane ?? "open_minded_rank") as FeedLane,
    rankingHint: body.rankingHint ?? "",
    slotCount: Number(body.slotCount ?? 8),
    openMin: Number(body.openMin ?? 0.3),
    openMax: Number(body.openMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!feed) return json({ error: "bad_pack" }, { status: 400 });
  return json({ feed }, { status: 201 });
}
