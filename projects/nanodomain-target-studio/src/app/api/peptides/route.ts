import { guard, json } from "@/lib/api";
import { archivePeptide, createPeptide, listPeptides } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPeptides({
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
    const peptide = archivePeptide(body.id);
    if (!peptide) return json({ error: "not_found" }, { status: 404 });
    return json({ peptide });
  }
  const peptide = createPeptide({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "pde_pry",
    pryHint: body.pryHint ?? "",
    pryFloor: Number(body.pryFloor ?? 0.4),
    systolicFloor: Number(body.systolicFloor ?? 0.5),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!peptide) return json({ error: "bad_pack" }, { status: 400 });
  return json({ peptide }, { status: 201 });
}
