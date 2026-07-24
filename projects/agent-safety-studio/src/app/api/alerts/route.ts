import { guard, json } from "@/lib/api";
import {
  advanceAlert,
  createAlert,
  listAlerts,
  paginate,
  type AlertSeverity,
  type ScoreMode,
} from "@/store";
import type { MonitorProfile, SafetyInput } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const fleetId = url.searchParams.get("fleetId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listAlerts(fleetId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    fleetId?: string;
    monitorId?: string;
    title?: string;
    severity?: AlertSeverity;
    mode?: ScoreMode;
    profile?: MonitorProfile;
    safetyInput?: Partial<SafetyInput>;
    id?: string;
    status?: "open" | "acked" | "resolved";
  };
  if (body.id && body.status) {
    try {
      return json(advanceAlert(body.id, body.status));
    } catch {
      return json({ error: "alert_not_found" }, { status: 404 });
    }
  }
  if (!body.fleetId || !body.title?.trim()) {
    return json({ error: "fleet_and_title_required" }, { status: 400 });
  }
  try {
    const alert = createAlert({
      fleetId: body.fleetId,
      monitorId: body.monitorId,
      title: body.title,
      severity: body.severity,
      mode: body.mode,
      profile: body.profile,
      safetyInput: body.safetyInput,
    });
    return json(alert, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return json({ error: msg }, { status: 404 });
  }
}
