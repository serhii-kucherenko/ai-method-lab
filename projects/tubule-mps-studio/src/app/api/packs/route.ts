import { guard, json } from "@/lib/api";
import { archivePack, createPack, listPacks } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archivePack(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.label !== "string" ||
    typeof body.version !== "string" ||
    typeof body.programFocus !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createPack({
      label: body.label,
      version: body.version,
      programFocus: body.programFocus,
      tubuleBudget:
        typeof body.tubuleBudget === "number" ? body.tubuleBudget : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    }),
  );
}
