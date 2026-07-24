import { guard, json } from "@/lib/api";
import {
  createMonitor,
  listMonitors,
  setMonitorActive,
  type CheckKind,
  type DeployMode,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const fleetId = url.searchParams.get("fleetId") ?? undefined;
  return json({ items: listMonitors(fleetId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    fleetId?: string;
    name?: string;
    checkKind?: CheckKind;
    coverage?: number;
    deployMode?: DeployMode;
    active?: boolean;
    id?: string;
    toggle?: boolean;
  };
  if (body.id && typeof body.toggle === "boolean") {
    try {
      return json(setMonitorActive(body.id, body.toggle));
    } catch {
      return json({ error: "monitor_not_found" }, { status: 404 });
    }
  }
  if (!body.fleetId || !body.name?.trim()) {
    return json({ error: "fleet_and_name_required" }, { status: 400 });
  }
  try {
    const monitor = createMonitor({
      fleetId: body.fleetId,
      name: body.name,
      checkKind: body.checkKind ?? "cfg",
      coverage: body.coverage ?? 0.7,
      deployMode: body.deployMode,
      active: body.active,
    });
    return json(monitor, { status: 201 });
  } catch {
    return json({ error: "fleet_not_found" }, { status: 404 });
  }
}
