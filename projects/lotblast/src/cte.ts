export type LocationDescription = {
  business_name: string;
  phone: string;
  street_or_geo: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
};

export type ProductDescription = {
  product_name: string;
  brand_name?: string;
  commodity?: string;
  variety?: string;
  packaging_size: string;
  packaging_style?: string;
};

export type RefDoc = {
  type: string;
  number: string;
};

export type TlcSource =
  | { kind: "location"; location: LocationDescription }
  | { kind: "reference"; reference: string };

export type ReceivingInput = {
  tlc: string;
  qty: number;
  uom: string;
  kind: "ingredient" | "intermediate" | "finished";
  product: ProductDescription;
  previous_source: LocationDescription;
  received_at: LocationDescription;
  event_date: string;
  tlc_source: TlcSource;
  reference_documents: RefDoc[];
};

export type TransformInput = {
  inputs: Array<{ tlc: string; qty: number }>;
  output: {
    tlc: string;
    qty: number;
    uom: string;
    kind: "ingredient" | "intermediate" | "finished";
    product: ProductDescription;
  };
  scrap_qty?: number;
  scrap_uom?: string;
  transformed_at: LocationDescription;
  tlc_source: TlcSource;
  event_date: string;
  reference_documents: RefDoc[];
};

export type ShippingInput = {
  id?: string;
  tlc: string;
  qty: number;
  uom: string;
  product: ProductDescription;
  subsequent_recipient: LocationDescription;
  shipped_from: LocationDescription;
  event_date: string;
  tlc_source: TlcSource;
  reference_documents: RefDoc[];
};

export type ReceivingRow = {
  tlc: string;
  qty: number;
  uom: string;
  product: ProductDescription;
  previous_source: LocationDescription;
  received_at: LocationDescription;
  event_date: string;
  tlc_source: TlcSource;
  reference_documents: RefDoc[];
};

export type ShippingRow = {
  tlc: string;
  qty: number;
  uom: string;
  product: ProductDescription;
  subsequent_recipient: LocationDescription;
  shipped_from: LocationDescription;
  event_date: string;
  tlc_source: TlcSource;
  reference_documents: RefDoc[];
};

export type TransformationRow = {
  from_tlc: string;
  from_product: ProductDescription;
  from_qty_used: number;
  from_uom: string;
  to_tlc: string;
  to_product: ProductDescription;
  to_qty: number;
  to_uom: string;
  transformed_at: LocationDescription;
  tlc_source: TlcSource;
  event_date: string;
  reference_documents: RefDoc[];
};

export type MockRecallExport = {
  recall_id: string;
  locked_at: string;
  suspect_tlc: string;
  blast: {
    finished_tlcs: string[];
    shipment_ids: string[];
    notify_partners: string[];
    units_in_channel: number;
  };
  sheets: {
    receiving: ReceivingRow[];
    transformation: TransformationRow[];
    shipping: ShippingRow[];
  };
};

export type ValidateOk = { ok: true };
export type ValidateErr = { ok: false; error: string };
export type ValidateResult = ValidateOk | ValidateErr;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function validateLocation(loc: unknown, label: string): ValidateResult {
  if (!isRecord(loc)) return { ok: false, error: `${label} required` };
  const phone = String(loc.phone ?? "").trim();
  const street = String(loc.street_or_geo ?? "").trim();
  if (!phone || !street) {
    return { ok: false, error: `${label} missing phone or street` };
  }
  for (const key of [
    "business_name",
    "city",
    "region",
    "postal_code",
  ] as const) {
    if (!String(loc[key] ?? "").trim()) {
      return { ok: false, error: `${label} incomplete` };
    }
  }
  return { ok: true };
}

export function validateTlcSource(src: unknown): ValidateResult {
  if (!isRecord(src)) return { ok: false, error: "tlc_source required" };
  const kind = String(src.kind ?? "");
  const hasLoc = src.location !== undefined && src.location !== null;
  const hasRef =
    src.reference !== undefined &&
    src.reference !== null &&
    String(src.reference).trim() !== "";
  if (kind === "location") {
    if (!hasLoc || hasRef) {
      return { ok: false, error: "tlc_source XOR violated" };
    }
    return validateLocation(src.location, "tlc_source.location");
  }
  if (kind === "reference") {
    if (!hasRef || hasLoc) {
      return { ok: false, error: "tlc_source XOR violated" };
    }
    return { ok: true };
  }
  if (hasLoc && hasRef) return { ok: false, error: "tlc_source XOR violated" };
  if (!hasLoc && !hasRef) return { ok: false, error: "tlc_source XOR violated" };
  return { ok: false, error: "tlc_source kind invalid" };
}

export function validateProduct(p: unknown): ValidateResult {
  if (!isRecord(p)) return { ok: false, error: "product required" };
  if (!String(p.product_name ?? "").trim() || !String(p.packaging_size ?? "").trim()) {
    return { ok: false, error: "product incomplete" };
  }
  return { ok: true };
}

export function validateRefDocs(docs: unknown): ValidateResult {
  if (!Array.isArray(docs) || docs.length < 1) {
    return { ok: false, error: "reference_documents required" };
  }
  for (const d of docs) {
    if (!isRecord(d) || !String(d.type ?? "").trim() || !String(d.number ?? "").trim()) {
      return { ok: false, error: "reference_documents invalid" };
    }
  }
  return { ok: true };
}

export function validateReceiving(input: unknown): ValidateResult {
  if (!isRecord(input)) return { ok: false, error: "body required" };
  if (!String(input.tlc ?? "").trim()) return { ok: false, error: "tlc required" };
  if (!(Number(input.qty) > 0)) return { ok: false, error: "qty required" };
  if (!String(input.uom ?? "").trim()) return { ok: false, error: "uom required" };
  if (!["ingredient", "intermediate", "finished"].includes(String(input.kind ?? ""))) {
    return { ok: false, error: "kind required" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.event_date ?? ""))) {
    return { ok: false, error: "event_date required" };
  }
  for (const step of [
    validateProduct(input.product),
    validateLocation(input.previous_source, "previous_source"),
    validateLocation(input.received_at, "received_at"),
    validateTlcSource(input.tlc_source),
    validateRefDocs(input.reference_documents),
  ]) {
    if (!step.ok) return step;
  }
  return { ok: true };
}

export function validateTransform(input: unknown): ValidateResult {
  if (!isRecord(input)) return { ok: false, error: "body required" };
  if (!Array.isArray(input.inputs) || input.inputs.length < 1) {
    return { ok: false, error: "transformation requires inputs" };
  }
  for (const inp of input.inputs) {
    if (!isRecord(inp) || !String(inp.tlc ?? "").trim() || !(Number(inp.qty) > 0)) {
      return { ok: false, error: "inputs invalid" };
    }
  }
  if (!isRecord(input.output)) return { ok: false, error: "output required" };
  if (!String(input.output.tlc ?? "").trim()) return { ok: false, error: "output.tlc required" };
  if (!(Number(input.output.qty) > 0)) return { ok: false, error: "output.qty required" };
  if (!String(input.output.uom ?? "").trim()) return { ok: false, error: "output.uom required" };
  if (!["ingredient", "intermediate", "finished"].includes(String(input.output.kind ?? ""))) {
    return { ok: false, error: "output.kind required" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.event_date ?? ""))) {
    return { ok: false, error: "event_date required" };
  }
  for (const step of [
    validateProduct(input.output.product),
    validateLocation(input.transformed_at, "transformed_at"),
    validateTlcSource(input.tlc_source),
    validateRefDocs(input.reference_documents),
  ]) {
    if (!step.ok) return step;
  }
  return { ok: true };
}

export function validateShipping(input: unknown): ValidateResult {
  if (!isRecord(input)) return { ok: false, error: "body required" };
  if (!String(input.tlc ?? "").trim()) return { ok: false, error: "tlc required" };
  if (!(Number(input.qty) > 0)) return { ok: false, error: "qty required" };
  if (!String(input.uom ?? "").trim()) return { ok: false, error: "uom required" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.event_date ?? ""))) {
    return { ok: false, error: "event_date required" };
  }
  for (const step of [
    validateProduct(input.product),
    validateLocation(input.subsequent_recipient, "subsequent_recipient"),
    validateLocation(input.shipped_from, "shipped_from"),
    validateTlcSource(input.tlc_source),
    validateRefDocs(input.reference_documents),
  ]) {
    if (!step.ok) return step;
  }
  return { ok: true };
}

export function asLocation(loc: Record<string, unknown>): LocationDescription {
  return {
    business_name: String(loc.business_name ?? ""),
    phone: String(loc.phone ?? ""),
    street_or_geo: String(loc.street_or_geo ?? ""),
    city: String(loc.city ?? ""),
    region: String(loc.region ?? ""),
    postal_code: String(loc.postal_code ?? ""),
    country: String(loc.country ?? ""),
  };
}

export function asProduct(p: Record<string, unknown>): ProductDescription {
  const out: ProductDescription = {
    product_name: String(p.product_name ?? ""),
    packaging_size: String(p.packaging_size ?? ""),
  };
  if (p.brand_name !== undefined) out.brand_name = String(p.brand_name);
  if (p.commodity !== undefined) out.commodity = String(p.commodity);
  if (p.variety !== undefined) out.variety = String(p.variety);
  if (p.packaging_style !== undefined) out.packaging_style = String(p.packaging_style);
  return out;
}

export function asTlcSource(src: Record<string, unknown>): TlcSource {
  if (String(src.kind) === "location") {
    return { kind: "location", location: asLocation(src.location as Record<string, unknown>) };
  }
  return { kind: "reference", reference: String(src.reference ?? "") };
}

export function asRefDocs(docs: unknown[]): RefDoc[] {
  return docs.map((d) => {
    const r = d as Record<string, unknown>;
    return { type: String(r.type ?? ""), number: String(r.number ?? "") };
  });
}
