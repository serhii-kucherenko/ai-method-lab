export type Window = { target_day: number; before: number; after: number };

export type ProtocolVersion = {
  id: string;
  effective_at: string;
  visits: Record<string, Window>;
};

export type Subject = { id: string; enrollment: string };

export type VisitInput = {
  code: string;
  actual: string | null;
  locked: boolean;
  scored_version_id?: string;
  classification?: Classification;
};

export type Classification =
  | "on_time"
  | "early"
  | "late"
  | "missed"
  | "out_of_window"
  | "pending";

export type ScoreResult = {
  version_id: string;
  classification: Classification;
  important: boolean;
};

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function cmpIso(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function sortVersions(versions: ProtocolVersion[]): ProtocolVersion[] {
  return [...versions].sort((a, b) => {
    const c = cmpIso(a.effective_at, b.effective_at);
    return c !== 0 ? c : a.id.localeCompare(b.id);
  });
}

export function resolveVersion(versions: ProtocolVersion[], asOf: string): ProtocolVersion {
  const candidates = sortVersions(versions).filter((v) => cmpIso(v.effective_at, asOf) <= 0);
  if (!candidates.length) throw new Error(`no version for ${asOf}`);
  return candidates[candidates.length - 1]!;
}

export function canPublish(existing: ProtocolVersion[], next: ProtocolVersion): boolean {
  if (!existing.length) return true;
  const latest = sortVersions(existing)[existing.length - 1]!;
  return cmpIso(next.effective_at, latest.effective_at) >= 0;
}

export function scoreVisit(
  versions: ProtocolVersion[],
  subject: Subject,
  visit: VisitInput,
  importantCodes: string[],
  asOfMissed?: string,
): ScoreResult {
  if (visit.locked && visit.classification) {
    const important =
      (visit.classification === "missed" || visit.classification === "out_of_window") &&
      importantCodes.includes(visit.code);
    return {
      version_id: visit.scored_version_id ?? "",
      classification: visit.classification,
      important,
    };
  }

  const asOf = visit.actual ?? asOfMissed;
  if (!asOf) throw new Error("need actual or as_of_missed");
  const v = resolveVersion(versions, asOf);
  const w = v.visits[visit.code];
  if (!w) throw new Error(`unknown visit ${visit.code}`);
  const target = addDays(subject.enrollment, w.target_day);
  const open = addDays(target, -w.before);
  const close = addDays(target, w.after);

  let classification: Classification;
  if (!visit.actual) {
    classification = cmpIso(asOfMissed!, close) > 0 ? "missed" : "pending";
  } else {
    const a = visit.actual;
    if (cmpIso(a, open) < 0 || cmpIso(a, close) > 0) classification = "out_of_window";
    else if (cmpIso(a, target) < 0) classification = "early";
    else if (cmpIso(a, target) > 0) classification = "late";
    else classification = "on_time";
  }

  const important =
    (classification === "missed" || classification === "out_of_window") &&
    importantCodes.includes(visit.code);
  return { version_id: v.id, classification, important };
}
