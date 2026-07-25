import { guard, json } from "@/lib/api";
import { archiveDetection, createDetection, listDetections } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listDetections({
      q: url.searchParams.get("q") ?? undefined,
      taskChannel: url.searchParams.get("taskChannel") ?? undefined,
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
    const detection = archiveDetection(body.id);
    if (!detection) return json({ error: "not_found" }, { status: 404 });
    return json({ detection });
  }
  const detection = createDetection(body);
  return json({ detection }, { status: 201 });
}
