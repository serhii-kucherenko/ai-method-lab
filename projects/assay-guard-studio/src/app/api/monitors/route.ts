import { guard, json } from "@/lib/api";
import { createMonitor, listMonitors } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listMonitors({
      q: url.searchParams.get("q") ?? undefined,
      monitorChannel: url.searchParams.get("monitorChannel") ?? undefined,
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
  const monitor = createMonitor(body);
  return json({ monitor }, { status: 201 });
}
