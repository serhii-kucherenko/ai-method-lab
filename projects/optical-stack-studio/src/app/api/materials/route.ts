import { guard, json } from "@/lib/api";
import { createSequence, listSequences, type MaterialKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSequences(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    name?: string;
    materials?: MaterialKind[];
    diversity?: number;
    notes?: string;
  };
  if (!body.briefId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSequence({
        briefId: body.briefId,
        name: body.name,
        materials: body.materials ?? ["SiO2", "TiO2"],
        diversity: body.diversity,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
