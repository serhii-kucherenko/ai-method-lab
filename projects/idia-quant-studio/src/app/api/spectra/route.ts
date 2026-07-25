import { guard, json } from "@/lib/api";
import { archiveSpectrum, createSpectrum, listSpectra } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSpectra({
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
  if (body.action === "archive") {
    const spectrum = archiveSpectrum(body.id);
    if (!spectrum) return json({ error: "not_found" }, { status: 404 });
    return json({ spectrum });
  }
  const spectrum = createSpectrum(body);
  if (!spectrum) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ spectrum }, { status: 201 });
}
