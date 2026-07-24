import { guard, json } from "@/lib/api";
import { createBrief, listBriefs, type BandKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listBriefs(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    goalText?: string;
    bandKind?: BandKind;
    clarity?: number;
    notes?: string;
  };
  if (!body.name || !body.goalText || !body.bandKind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createBrief({
      name: body.name,
      goalText: body.goalText,
      bandKind: body.bandKind,
      clarity: body.clarity,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
