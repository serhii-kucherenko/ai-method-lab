const state = {
  token: null,
  deskId: null,
  policyId: null,
  claim: null,
};

const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? {} : await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function show(obj) {
  $("view").textContent = JSON.stringify(obj, null, 2);
}

async function auth(kind) {
  try {
    const data = await api("POST", `/auth/${kind}`, {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = err.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("start").onclick = async () => {
  try {
    const desk = await api("POST", "/desks", { name: $("desk-name").value });
    state.deskId = desk.desk.id;
    const policy = await api("POST", `/desks/${state.deskId}/policies`, {
      number: $("policy-number").value,
      holder: "Demo holder",
    });
    state.policyId = policy.policy.id;
    const claim = await api("POST", `/policies/${state.policyId}/claims`, {
      title: $("claim-title").value,
    });
    state.claim = claim.claim;
    const reserved = await api("POST", `/claims/${state.claim.id}/reserve`, {
      amount: 1000,
    });
    state.claim = reserved.claim;
    $("review").disabled = false;
    $("flow-status").textContent = "Claim filed with $1000 reserve.";
    show(state.claim);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("review").onclick = async () => {
  try {
    const data = await api("POST", `/claims/${state.claim.id}/transition`, {
      to: "review",
      version: state.claim.version,
    });
    state.claim = data.claim;
    $("evidence").disabled = false;
    $("flow-status").textContent = "In review — add evidence.";
    show(state.claim);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("evidence").onclick = async () => {
  try {
    const data = await api("POST", `/claims/${state.claim.id}/evidence`, {
      label: "Police report",
      kind: "doc",
    });
    state.claim = data.claim;
    $("settle").disabled = false;
    $("flow-status").textContent = "Evidence attached.";
    show(data);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("settle").onclick = async () => {
  try {
    const data = await api("POST", `/claims/${state.claim.id}/transition`, {
      to: "settled",
      version: state.claim.version,
      payout: 800,
    });
    state.claim = data.claim;
    $("flow-status").textContent = "Settled.";
    show(state.claim);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};
