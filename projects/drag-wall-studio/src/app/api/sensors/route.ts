import { guard, json } from "@/lib/api";
import { createSensor, listSensors } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSensors({
      q: url.searchParams.get("q") ?? undefined,
      channel: url.searchParams.get("channel") ?? undefined,
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
  const sensor = createSensor(await req.json());
  return json({ sensor }, { status: 201 });
}
