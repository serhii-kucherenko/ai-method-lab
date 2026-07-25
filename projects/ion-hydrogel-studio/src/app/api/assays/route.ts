import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      gelId: url.searchParams.get("gelId") ?? undefined,
      chargeId: url.searchParams.get("chargeId") ?? undefined,
      saltId: url.searchParams.get("saltId") ?? undefined,
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
    gelId: body.gelId ?? "gel-demo",
    chargeId: body.chargeId ?? "charge-demo",
    saltId: body.saltId ?? "salt-demo",
    chargeRegulation: Number(body.chargeRegulation ?? 0.6),
    ionMobility: Number(body.ionMobility ?? 0.65),
    gelPermeability: Number(body.gelPermeability ?? 0.7),
    swellingRatio: Number(body.swellingRatio ?? 0.65),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
