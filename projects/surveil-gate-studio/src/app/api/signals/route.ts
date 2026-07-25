import { guard, json } from "@/lib/api";
import { archiveSignal, createSignal, listSignals } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSignals({
      q: url.searchParams.get("q") ?? undefined,
      feedChannel: url.searchParams.get("feedChannel") ?? undefined,
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
    const signal = archiveSignal(body.id);
    if (!signal) return json({ error: "not_found" }, { status: 404 });
    return json({ signal });
  }
  const signal = createSignal({
    packId: body.packId,
    label: body.label,
    signalNotes: body.signalNotes ?? body.sessionNotes ?? "",
    lockCondition: body.lockCondition,
    feedChannel: body.feedChannel ?? body.captureChannel ?? "",
    notes: body.notes,
  });
  return json({ signal }, { status: 201 });
}
