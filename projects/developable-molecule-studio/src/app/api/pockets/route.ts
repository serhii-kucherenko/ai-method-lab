import { guard, json } from "@/lib/api";
import { createPocket, listPockets, type PocketFamily } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listPockets(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    family?: PocketFamily;
    volumeA3?: number;
    hydrophobicity?: number;
    notes?: string;
  };
  if (!body.name || !body.family || body.volumeA3 == null || body.hydrophobicity == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createPocket({
      name: body.name,
      family: body.family,
      volumeA3: body.volumeA3,
      hydrophobicity: body.hydrophobicity,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
