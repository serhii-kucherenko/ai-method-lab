import { guard, json } from "@/lib/api";
import { createSensor, listSensors, paginate } from "@/store";
import type { SensorMetric } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const siteId = url.searchParams.get("siteId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const maxAnomalyRaw = url.searchParams.get("maxAnomaly");
  const maxAnomaly = maxAnomalyRaw ? Number(maxAnomalyRaw) : undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(paginate(listSensors(siteId, q, maxAnomaly), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    siteId?: string;
    name?: string;
    metric?: SensorMetric;
    sampleRateHz?: number;
    anomalyScore?: number;
    notes?: string;
  };
  if (!body.siteId || !body.name?.trim()) {
    return json({ error: "site_and_name_required" }, { status: 400 });
  }
  try {
    const sensor = createSensor({
      siteId: body.siteId,
      name: body.name,
      metric: body.metric ?? "vibration",
      sampleRateHz: body.sampleRateHz ?? 50,
      anomalyScore: body.anomalyScore ?? 0.2,
      notes: body.notes ?? "",
    });
    return json(sensor, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
