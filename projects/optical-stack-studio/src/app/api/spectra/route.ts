import { guard, json } from "@/lib/api";
import { createSpectrum, listSpectra, type SpectrumStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSpectra(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    stackId?: string;
    name?: string;
    status?: SpectrumStatus;
    spectrumFit?: number;
    angleTolerance?: number;
    absorptionLoss?: number;
    notes?: string;
  };
  if (!body.briefId || !body.stackId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSpectrum({
        briefId: body.briefId,
        stackId: body.stackId,
        name: body.name,
        status: body.status,
        spectrumFit: body.spectrumFit,
        angleTolerance: body.angleTolerance,
        absorptionLoss: body.absorptionLoss,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
