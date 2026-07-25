import { guard, json } from "@/lib/api";
import { archiveDesign, createDesign, listDesigns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listDesigns({
      q: url.searchParams.get("q") ?? undefined,
      designChannel: url.searchParams.get("designChannel") ?? undefined,
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
    const design = archiveDesign(body.id);
    if (!design) return json({ error: "not_found" }, { status: 404 });
    return json({ design });
  }
  const design = createDesign({
    packId: body.packId,
    label: body.label,
    recipeNotes: body.recipeNotes ?? body.windowHours ?? "",
    lockCondition: body.lockCondition ?? "review",
    designChannel: body.designChannel ?? body.therapyChannel ?? "",
    notes: body.notes,
  });
  return json({ design }, { status: 201 });
}
