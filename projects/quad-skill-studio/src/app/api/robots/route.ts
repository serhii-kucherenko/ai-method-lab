import { guard, json } from "@/lib/api";
import { createRobot, listRobots, type RobotPlatform } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listRobots(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    platform?: RobotPlatform;
    massKg?: number;
    legLengthMm?: number;
    notes?: string;
  };
  if (!body.name || !body.platform || body.massKg == null || body.legLengthMm == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createRobot({
      name: body.name,
      platform: body.platform,
      massKg: body.massKg,
      legLengthMm: body.legLengthMm,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
