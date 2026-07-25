import { guard, json } from "@/lib/api";
import { archiveInpaint, createInpaint, listInpaints } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listInpaints({
      q: url.searchParams.get("q") ?? undefined,
      signalChannel: url.searchParams.get("signalChannel") ?? undefined,
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
    const inpaint = archiveInpaint(body.id);
    if (!inpaint) return json({ error: "not_found" }, { status: 404 });
    return json({ inpaint });
  }
  const inpaint = createInpaint({
    packId: body.packId,
    label: body.label,
    recipe: body.recipe ?? body.field ?? "",
    lockCondition: body.lockCondition,
    signalChannel:
      body.signalChannel ?? body.visionChannel ?? "soft_sim_nicu_ecg_signal",
    notes: body.notes,
  });
  return json({ inpaint }, { status: 201 });
}
