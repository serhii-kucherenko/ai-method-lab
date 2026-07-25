import { guard, json } from "@/lib/api";
import { createDraft, listDrafts } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listDrafts({
      collaboratorId: url.searchParams.get("collaboratorId") ?? undefined,
      schemaId: url.searchParams.get("schemaId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const draft = createDraft(body);
  if (!draft) return json({ error: "missing_entities" }, { status: 400 });
  return json({ draft }, { status: 201 });
}
