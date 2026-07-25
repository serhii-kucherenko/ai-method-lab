import { guard, json } from "@/lib/api";
import { archivePpgChannel, createPpgChannel, listPpgChannels } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPpgChannels({
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
    const channel = archivePpgChannel(body.id);
    if (!channel) return json({ error: "not_found" }, { status: 404 });
    return json({ channel });
  }
  const channel = createPpgChannel({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    channelHint: body.channelHint ?? body.poseHint ?? "",
    caseCount: body.caseCount,
    hardnessMin: body.hardnessMin,
    hardnessMax: body.hardnessMax,
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!channel) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ channel }, { status: 201 });
}
