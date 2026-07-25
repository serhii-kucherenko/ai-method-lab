import { guard, json } from "@/lib/api";
import { archiveOnset, createOnset, listOnsets } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listOnsets({
      q: url.searchParams.get("q") ?? undefined,
      therapyChannel: url.searchParams.get("therapyChannel") ?? undefined,
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
    const onset = archiveOnset(body.id);
    if (!onset) return json({ error: "not_found" }, { status: 404 });
    return json({ onset });
  }
  const onset = createOnset({
    packId: body.packId,
    label: body.label,
    windowHours: body.windowHours ?? body.regimen ?? "",
    lockCondition: body.lockCondition ?? "review",
    therapyChannel: body.therapyChannel ?? body.signalChannel ?? "",
    notes: body.notes,
  });
  return json({ onset }, { status: 201 });
}
