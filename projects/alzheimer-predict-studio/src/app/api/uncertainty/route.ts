import { guard, json } from "@/lib/api";
import { createBand, listBands, type BandStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listBands(runId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    runId?: string;
    name?: string;
    status?: BandStatus;
    lower?: number;
    upper?: number;
    coverageTarget?: number;
    notes?: string;
  };
  if (!body.runId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createBand({
        runId: body.runId,
        name: body.name,
        status: body.status,
        lower: body.lower,
        upper: body.upper,
        coverageTarget: body.coverageTarget,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
