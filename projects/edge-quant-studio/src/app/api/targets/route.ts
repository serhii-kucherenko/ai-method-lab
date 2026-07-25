import { guard, json } from "@/lib/api";
import { createTarget, listTargets } from "@/store";
import type { CpuClass } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const cpuClass = (url.searchParams.get("cpuClass") ?? undefined) as
    | CpuClass
    | undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listTargets(q, page, pageSize, cpuClass));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    cpuClass?: CpuClass;
    memoryMb?: number;
    lutAffinity?: number;
    simdWidth?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.cpuClass) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const item = createTarget({
    name: body.name,
    cpuClass: body.cpuClass,
    memoryMb: body.memoryMb,
    lutAffinity: body.lutAffinity,
    simdWidth: body.simdWidth,
    notes: body.notes,
  });
  return json({ item }, { status: 201 });
}
