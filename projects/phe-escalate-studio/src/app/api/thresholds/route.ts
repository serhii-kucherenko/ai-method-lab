import { guard, json } from "@/lib/api";
import {
  archiveThreshold,
  createThreshold,
  listThresholds,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listThresholds({
      q: url.searchParams.get("q") ?? undefined,
      signalChannel: url.searchParams.get("signalChannel") ?? undefined,
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
    const threshold = archiveThreshold(body.id);
    if (!threshold) return json({ error: "not_found" }, { status: 404 });
    return json({ threshold });
  }
  const threshold = createThreshold(body);
  return json({ threshold }, { status: 201 });
}
