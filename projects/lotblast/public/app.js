const state = { token: null, userId: null };
const $ = (id) => document.getElementById(id);

const loc = {
  business_name: "Demo Plant",
  phone: "+1 555 0200",
  street_or_geo: "9 Pack Ave",
  city: "Oakland",
  region: "CA",
  postal_code: "94607",
  country: "",
};

const supplier = {
  business_name: "Supplier Co",
  phone: "+1 555 0100",
  street_or_geo: "1 Farm Rd",
  city: "Salinas",
  region: "CA",
  postal_code: "93901",
  country: "",
};

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function auth(kind) {
  try {
    const data = await api("POST", `/auth/${kind}`, {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    state.userId = data.user.id;
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (e) {
    $("auth-status").textContent = e.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("run").onclick = async () => {
  try {
    const plant = (await api("POST", "/plants", { name: "Demo Plant" })).plant;
    await api("POST", `/plants/${plant.id}/members`, {
      userId: state.userId,
      role: "recall_admin",
    });

    await api("POST", `/plants/${plant.id}/receiving`, {
      tlc: "ING-A",
      qty: 100,
      uom: "kg",
      kind: "ingredient",
      product: { product_name: "Spice Base", packaging_size: "25kg" },
      previous_source: supplier,
      received_at: loc,
      event_date: "2026-06-01",
      tlc_source: { kind: "reference", reference: "https://example.com/tlc/ING-A" },
      reference_documents: [{ type: "BOL", number: "BOL-1" }],
    });

    await api("POST", `/plants/${plant.id}/transformations`, {
      inputs: [{ tlc: "ING-A", qty: 40 }],
      output: {
        tlc: "FG-1",
        qty: 50,
        uom: "cases",
        kind: "finished",
        product: { product_name: "Finished", packaging_size: "case" },
      },
      transformed_at: loc,
      tlc_source: { kind: "reference", reference: "https://example.com/tlc/FG-1" },
      event_date: "2026-06-02",
      reference_documents: [{ type: "WO", number: "WO-1" }],
    });

    await api("POST", `/plants/${plant.id}/shipments`, {
      id: "S-1",
      tlc: "FG-1",
      qty: 30,
      uom: "cases",
      product: { product_name: "Finished", packaging_size: "case" },
      subsequent_recipient: {
        business_name: "Retail Co",
        phone: "+1 555 0400",
        street_or_geo: "3 Market",
        city: "SF",
        region: "CA",
        postal_code: "94103",
        country: "",
      },
      shipped_from: loc,
      event_date: "2026-06-03",
      tlc_source: { kind: "reference", reference: "https://example.com/tlc/FG-1" },
      reference_documents: [{ type: "BOL", number: "SHIP-1" }],
    });

    const blast = await api("GET", `/plants/${plant.id}/blast?suspect=ING-A&limit=20&offset=0`);
    const recall = await api("POST", `/plants/${plant.id}/recalls`, {
      suspect_tlc: "ING-A",
    });

    $("flow-status").textContent = "Mock recall locked.";
    $("view").textContent = JSON.stringify({ blast, export: recall.export }, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
