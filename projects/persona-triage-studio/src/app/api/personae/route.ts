import { guard, json } from "@/lib/api";
import { createPersona, listPersonae } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPersonae({
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
  const persona = createPersona({
    packId: String(body.packId ?? "pack-demo"),
    label: String(body.label ?? "Untitled persona"),
    emotionalTag: String(body.emotionalTag ?? "neutral"),
    strategyTag: String(body.strategyTag ?? "direct"),
    styleAxes: Array.isArray(body.styleAxes)
      ? body.styleAxes.map(String)
      : undefined,
    verbosity: body.verbosity != null ? Number(body.verbosity) : undefined,
    hedging: body.hedging != null ? Number(body.hedging) : undefined,
    notes: body.notes ? String(body.notes) : "",
  });
  if (!persona) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ persona }, { status: 201 });
}
