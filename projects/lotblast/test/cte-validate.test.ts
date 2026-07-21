import assert from "node:assert/strict";
import { test } from "node:test";
import {
  validateReceiving,
  validateTlcSource,
  validateTransform,
} from "../src/cte.js";

const loc = {
  business_name: "Plant",
  phone: "+1 555 0100",
  street_or_geo: "1 Main",
  city: "Oakland",
  region: "CA",
  postal_code: "94607",
  country: "",
};

const product = { product_name: "Spice", packaging_size: "25kg" };

test("rejects TLC source with both location and reference", () => {
  const r = validateTlcSource({
    kind: "location",
    location: loc,
    reference: "https://x",
  });
  assert.equal(r.ok, false);
});

test("rejects TLC source with neither", () => {
  const r = validateTlcSource({ kind: "reference" });
  assert.equal(r.ok, false);
});

test("rejects location missing phone", () => {
  const r = validateReceiving({
    tlc: "ING-A",
    qty: 10,
    uom: "kg",
    kind: "ingredient",
    product,
    previous_source: { ...loc, phone: "" },
    received_at: loc,
    event_date: "2026-06-01",
    tlc_source: { kind: "reference", reference: "https://x" },
    reference_documents: [{ type: "BOL", number: "1" }],
  });
  assert.equal(r.ok, false);
});

test("rejects transformation with zero inputs", () => {
  const r = validateTransform({
    inputs: [],
    output: { tlc: "BAT-1", qty: 10, uom: "kg", kind: "intermediate", product },
    transformed_at: loc,
    tlc_source: { kind: "reference", reference: "https://x" },
    event_date: "2026-06-02",
    reference_documents: [{ type: "WO", number: "1" }],
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.error, /inputs/i);
});

test("accepts valid receiving", () => {
  const r = validateReceiving({
    tlc: "ING-A",
    qty: 10,
    uom: "kg",
    kind: "ingredient",
    product,
    previous_source: loc,
    received_at: loc,
    event_date: "2026-06-01",
    tlc_source: { kind: "reference", reference: "https://x" },
    reference_documents: [{ type: "BOL", number: "1" }],
  });
  assert.equal(r.ok, true);
});
