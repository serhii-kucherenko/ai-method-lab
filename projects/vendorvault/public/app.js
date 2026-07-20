const state = { token: null, finding: null, vendorId: null };
const $ = (id) => document.getElementById(id);

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
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (e) {
    $("auth-status").textContent = e.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("start").onclick = async () => {
  try {
    const ws = await api("POST", "/workspaces", { name: $("ws").value });
    const vendor = await api("POST", `/workspaces/${ws.workspace.id}/vendors`, {
      name: $("vendor").value,
    });
    state.vendorId = vendor.vendor.id;
    await api("POST", `/vendors/${state.vendorId}/attest`, { until: "2027-12-31" });
    const finding = await api("POST", `/vendors/${state.vendorId}/findings`, {
      title: "Access review gap",
      severity: "medium",
    });
    state.finding = finding.finding;
    $("remediate").disabled = false;
    $("flow-status").textContent = "Finding open.";
    $("view").textContent = JSON.stringify(state.finding, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};

$("remediate").onclick = async () => {
  try {
    const data = await api("POST", `/findings/${state.finding.id}/transition`, {
      to: "remediated",
      version: state.finding.version,
      remediation_note: "Closed gap",
    });
    state.finding = data.finding;
    $("accept").disabled = false;
    $("flow-status").textContent = "Remediated.";
    $("view").textContent = JSON.stringify(state.finding, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};

$("accept").onclick = async () => {
  try {
    const data = await api("POST", `/findings/${state.finding.id}/transition`, {
      to: "accepted",
      version: state.finding.version,
    });
    state.finding = data.finding;
    $("flow-status").textContent = "Accepted.";
    $("view").textContent = JSON.stringify(state.finding, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
