import { guard, json } from "@/lib/api";
import { createDevice, listDevices, type DeviceArch } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listDevices(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    arch?: DeviceArch;
    vramGb?: number;
    usableVramGb?: number;
    computeCapability?: string;
    notes?: string;
  };
  if (!body.name || !body.arch || body.vramGb == null || !body.computeCapability) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createDevice({
      name: body.name,
      arch: body.arch,
      vramGb: body.vramGb,
      usableVramGb: body.usableVramGb,
      computeCapability: body.computeCapability,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
