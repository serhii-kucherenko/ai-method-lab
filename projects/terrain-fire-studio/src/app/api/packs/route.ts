import { guard, json } from "@/lib/api";
import { createPack, listPacks, archivePack } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
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
  if (body?.action === "archive" && body.id) {
    const pack = archivePack(String(body.id));
    if (!pack) return json({ error: "not_found" }, { status: 404 });
    return json({ pack });
  }
  const pack = createPack({
    label: String(body.label ?? "Untitled pack"),
    region: String(body.region ?? "Unknown"),
    elevationSpanM: Number(body.elevationSpanM ?? 500),
    fuelLoadIndex: Number(body.fuelLoadIndex ?? 0.5),
    version: String(body.version ?? "1.0"),
    notes: body.notes ? String(body.notes) : "",
  });
  return json({ pack }, { status: 201 });
}
