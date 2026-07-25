import { guard, json } from "@/lib/api";
import { createAerial, listAerials } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAerials({
      packId: url.searchParams.get("packId") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const aerial = createAerial({
    packId: String(body.packId ?? ""),
    captureDate: String(body.captureDate ?? new Date().toISOString().slice(0, 10)),
    resolutionCm: Number(body.resolutionCm ?? 30),
    cloudCover: Number(body.cloudCover ?? 0.2),
    overlapRatio: Number(body.overlapRatio ?? 0.6),
    notes: body.notes ? String(body.notes) : "",
  });
  if (!aerial) return json({ error: "pack_required" }, { status: 400 });
  return json({ aerial }, { status: 201 });
}
