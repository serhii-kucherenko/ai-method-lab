import { guard, json } from "@/lib/api";
import { archivePose, createPose, listPoses } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPoses({
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
    const pose = archivePose(body.id);
    if (!pose) return json({ error: "not_found" }, { status: 404 });
    return json({ pose });
  }
  const pose = createPose(body);
  if (!pose) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ pose }, { status: 201 });
}
