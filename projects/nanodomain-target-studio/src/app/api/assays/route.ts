import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      nanodomainId: url.searchParams.get("nanodomainId") ?? undefined,
      peptideId: url.searchParams.get("peptideId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createAssayRun({
    packId: body.packId ?? "pack-demo",
    nanodomainId: body.nanodomainId ?? "nanodomain-demo",
    peptideId: body.peptideId ?? "peptide-demo",
    label: body.label,
    kind: body.kind ?? "diastolic_restore",
    nanodomainLocalization: Number(body.nanodomainLocalization ?? 0.6),
    pdePryStrength: Number(body.pdePryStrength ?? 0.55),
    assaySignal: Number(body.assaySignal ?? 0.6),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
