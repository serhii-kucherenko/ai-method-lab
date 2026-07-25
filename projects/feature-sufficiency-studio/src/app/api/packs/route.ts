import { guard, json } from "@/lib/api";
import { createPack, listPacks } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
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
  const pack = createPack({
    label: String(body.label ?? "Untitled pack"),
    version: String(body.version ?? "1.0"),
    clinicalDomain: String(body.clinicalDomain ?? "general"),
    featureCount:
      body.featureCount != null ? Number(body.featureCount) : undefined,
    notes: body.notes ? String(body.notes) : undefined,
  });
  return json({ pack }, { status: 201 });
}
