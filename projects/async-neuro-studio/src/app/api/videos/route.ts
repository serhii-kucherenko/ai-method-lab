import { guard, json } from "@/lib/api";
import { archiveVideo, createVideo, listVideos } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listVideos({
      q: url.searchParams.get("q") ?? undefined,
      captureChannel: url.searchParams.get("captureChannel") ?? undefined,
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
  if (body.action === "archive") {
    const video = archiveVideo(body.id);
    if (!video) return json({ error: "not_found" }, { status: 404 });
    return json({ video });
  }
  const video = createVideo({
    packId: body.packId,
    label: body.label,
    captureNotes: body.captureNotes ?? "",
    lockCondition: body.lockCondition ?? "review",
    captureChannel: body.captureChannel ?? "soft_sim_async_video",
    notes: body.notes,
  });
  return json({ video }, { status: 201 });
}
