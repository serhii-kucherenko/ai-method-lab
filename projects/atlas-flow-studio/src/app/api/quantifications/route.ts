import { guard, json } from "@/lib/api";
import {
  archiveQuantification,
  createQuantification,
  listQuantifications,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listQuantifications({
      q: url.searchParams.get("q") ?? undefined,
      quantChannel: url.searchParams.get("quantChannel") ?? undefined,
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
    const row = archiveQuantification(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ quantification: row });
  }
  const row = createQuantification(body);
  return json({ quantification: row }, { status: 201 });
}
