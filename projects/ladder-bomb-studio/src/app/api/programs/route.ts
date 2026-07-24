import { guard, json } from "@/lib/api";
import { createProgram, listPrograms, paginate } from "@/store";
import type { LadderDialect } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const plantId = url.searchParams.get("plantId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listPrograms(plantId, q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    plantId?: string;
    name?: string;
    dialect?: LadderDialect;
    fbCount?: number;
    lineCount?: number;
    notes?: string;
  };
  if (!body.plantId || !body.name?.trim()) {
    return json({ error: "plant_and_name_required" }, { status: 400 });
  }
  try {
    const program = createProgram({
      plantId: body.plantId,
      name: body.name,
      dialect: body.dialect ?? "ld",
      fbCount: body.fbCount ?? 4,
      lineCount: body.lineCount ?? 200,
      notes: body.notes ?? "",
    });
    return json(program, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
