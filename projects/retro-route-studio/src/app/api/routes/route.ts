import { guard, json } from "@/lib/api";
import { createRoute, listRoutes } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRoutes({
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
  const route = createRoute({
    packId: String(body.packId ?? ""),
    label: String(body.label ?? "Candidate route"),
    steps: Number(body.steps ?? 3),
    branchingFactor: Number(body.branchingFactor ?? 2),
    memoryCoverage: Number(body.memoryCoverage ?? 0.5),
    notes: body.notes ? String(body.notes) : "",
  });
  if (!route) return json({ error: "missing_pack" }, { status: 400 });
  return json({ route }, { status: 201 });
}
