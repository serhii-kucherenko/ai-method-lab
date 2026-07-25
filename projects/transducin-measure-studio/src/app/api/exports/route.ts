import { guard, json } from "@/lib/api";
import { createExport, listExports } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listExports({
      q: url.searchParams.get("q") ?? undefined,
      exportChannel: url.searchParams.get("exportChannel") ?? undefined,
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
  const exportRow = createExport(body);
  return json({ export: exportRow }, { status: 201 });
}
