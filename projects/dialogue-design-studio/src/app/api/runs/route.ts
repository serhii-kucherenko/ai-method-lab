import { guard, json } from "@/lib/api";
import { createDialogueRun, listDialogueRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listDialogueRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      badgeId: url.searchParams.get("badgeId") ?? undefined,
      feedId: url.searchParams.get("feedId") ?? undefined,
      topicId: url.searchParams.get("topicId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createDialogueRun({
    packId: body.packId,
    badgeId: body.badgeId,
    feedId: body.feedId,
    topicId: body.topicId,
    openMindedness: Number(body.openMindedness ?? 0.5),
    badgeClarity: Number(body.badgeClarity ?? 0.5),
    topicBalance: Number(body.topicBalance ?? 0.5),
    packReadiness: Number(body.packReadiness ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
