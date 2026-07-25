import { guard, json } from "@/lib/api";
import { createStyleAxis, listStyleAxes } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listStyleAxes({
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
  const axis = createStyleAxis({
    packId: String(body.packId ?? "pack-demo"),
    name: String(body.name ?? "Untitled axis"),
    lowPole: String(body.lowPole ?? "low"),
    highPole: String(body.highPole ?? "high"),
    weight: Number(body.weight ?? 0.5),
    notes: body.notes ? String(body.notes) : "",
  });
  if (!axis) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ axis }, { status: 201 });
}
