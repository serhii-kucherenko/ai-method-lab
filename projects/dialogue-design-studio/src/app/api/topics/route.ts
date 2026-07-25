import { guard, json } from "@/lib/api";
import { archiveTopic, createTopic, listTopics } from "@/store";
import type { TopicMode } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTopics({
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
    const topic = archiveTopic(body.id);
    if (!topic) return json({ error: "not_found" }, { status: 404 });
    return json({ topic });
  }
  const topic = createTopic({
    packId: body.packId,
    label: body.label,
    mode: (body.mode ?? "cross_cutting") as TopicMode,
    threadHint: body.threadHint ?? "",
    postCount: Number(body.postCount ?? 8),
    balanceFloor: Number(body.balanceFloor ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!topic) return json({ error: "bad_pack" }, { status: 400 });
  return json({ topic }, { status: 201 });
}
