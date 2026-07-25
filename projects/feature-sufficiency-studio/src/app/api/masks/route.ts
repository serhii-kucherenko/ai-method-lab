import { guard, json } from "@/lib/api";
import { createMask, listMasks } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listMasks({
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
  const mask = createMask({
    packId: String(body.packId ?? ""),
    label: String(body.label ?? "Untitled mask"),
    presentFeatures: Array.isArray(body.presentFeatures)
      ? body.presentFeatures.map(String)
      : [],
    coverageRatio: Number(body.coverageRatio ?? 0.5),
    salienceHint:
      body.salienceHint != null ? Number(body.salienceHint) : undefined,
    notes: body.notes ? String(body.notes) : undefined,
  });
  if (!mask) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ mask }, { status: 201 });
}
