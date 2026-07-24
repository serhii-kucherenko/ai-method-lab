import { guard, json } from "@/lib/api";
import { createAugment, listAugments, type AugmentKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listAugments(q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    kind?: AugmentKind;
    strength?: number;
    preserveAnatomy?: boolean;
    notes?: string;
  };
  if (!body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createAugment({
      name: body.name,
      kind: body.kind,
      strength: body.strength,
      preserveAnatomy: body.preserveAnatomy,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
