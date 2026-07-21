# lotblast export contract (draft)

Docs-only. Not an oracle until IDEA_DEPTH reaches `ready_to_build` and a brief is filed.

**Authority:** FDA illustrative electronic sortable spreadsheet — https://www.fda.gov/media/181945/download  
**Parent idea:** `docs/ideas/lotblast.md`

## Principles

1. One CTE family per sheet/section: `receiving` | `transformation` | `shipping`
2. One **Traceability Lot Code** per row (transformation: one row per **incoming** TLC used)
3. Columns are stable and sortable; missing required values → `export_status: blocked` or row `gap: true` (product must pick one policy and test it)
4. Location description is a **struct**, never a single id string in the export
5. TLC source location **XOR** TLC source reference (exactly one required)

## Shared types

```ts
type LocationDescription = {
  business_name: string;
  phone: string;
  street_or_geo: string;
  city: string;
  region: string; // state / province
  postal_code: string;
  country: string; // empty string allowed when n/a in domestic samples
};

type ProductDescription = {
  product_name: string;
  brand_name?: string;
  commodity?: string;
  variety?: string;
  packaging_size: string;
  packaging_style?: string;
};

type RefDoc = {
  type: string; // e.g. BOL, ASN, Invoice, Work Order
  number: string;
};

type TlcSource =
  | { kind: "location"; location: LocationDescription; reference?: undefined }
  | { kind: "reference"; reference: string; location?: undefined };
```

## Receiving row

```ts
type ReceivingRow = {
  tlc: string;
  qty: number;
  uom: string;
  product: ProductDescription;
  previous_source: LocationDescription;
  received_at: LocationDescription;
  event_date: string; // YYYY-MM-DD
  tlc_source: TlcSource;
  reference_documents: RefDoc[]; // ≥1
};
```

## Shipping row

```ts
type ShippingRow = {
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
```

## Transformation row (per input lot)

```ts
type TransformationRow = {
  from_tlc: string;
  from_product: ProductDescription;
  from_qty_used: number;
  from_uom: string;
  to_tlc: string;
  to_product: ProductDescription;
  to_qty: number;
  to_uom: string;
  transformed_at: LocationDescription; // also TLC source for to_tlc when kind=location
  tlc_source: TlcSource; // for to_tlc
  event_date: string;
  reference_documents: RefDoc[];
};
```

## Mock-recall export envelope

```ts
type MockRecallExport = {
  recall_id: string;
  locked_at: string; // ISO datetime
  suspect_tlc: string;
  blast: {
    finished_tlcs: string[];
    shipment_ids: string[];
    notify_partners: string[]; // derived from subsequent_recipient.business_name
    units_in_channel: number;
  };
  sheets: {
    receiving: ReceivingRow[];
    transformation: TransformationRow[];
    shipping: ShippingRow[];
  };
};
```

## Extra negative cases (add to idea test table)

| # | Case | Expect |
|---|------|--------|
| 26 | TLC source location and reference both set | rejected / export gap |
| 27 | TLC source neither location nor reference | rejected / export gap |
| 28 | Location missing phone or street | rejected on CTE write |
| 29 | Transformation with 0 input rows | rejected |
| 30 | Export after lock omits a blast member’s CTE | fail oracle |

## Status

Draft contract only. Promotes IDEA_DEPTH G5 when paired with RED tests — **not yet**.
