const state = {
  token: null,
  trainId: null,
  serviceId: null,
  release: null,
  checklistItemId: null,
  approvalCount: 0,
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
    const train = await api("POST", "/trains", { name: $("train-name").value });
    state.trainId = train.train.id;
    const service = await api("POST", `/trains/${state.trainId}/services`, {
      name: $("service-name").value,
    });
    state.serviceId = service.service.id;
    const rel = await api("POST", `/services/${state.serviceId}/releases`, {
      version: $("release-version").value,
    });
    state.release = rel.release;
    state.approvalCount = 0;
    $("checklist").disabled = false;
    $("flow-status").textContent = "Release planned — add checklist items.";
    show(state.release);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("checklist").onclick = async () => {
  try {
    const data = await api("POST", `/releases/${state.release.id}/checklist`, {
      label: "Smoke tests passed",
    });
    state.checklistItemId = data.item.id;
    await api(
      "POST",
      `/releases/${state.release.id}/checklist/${state.checklistItemId}/check`,
    );
    state.release = data.release;
    $("staging").disabled = false;
    $("flow-status").textContent = "Checklist checked — ready for staging.";
    show(state.release);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("staging").onclick = async () => {
  try {
    const data = await api("POST", `/releases/${state.release.id}/transition`, {
      to: "staging",
      versionNum: state.release.versionNum,
    });
    state.release = data.release;
    $("approve").disabled = false;
    $("flow-status").textContent = "In staging — approvals needed.";
    show(state.release);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("approve").onclick = async () => {
  try {
    const data = await api("POST", `/releases/${state.release.id}/approve`);
    state.approvalCount = data.approvalCount;
    if (state.approvalCount >= 2) {
      $("prod").disabled = false;
      $("approve").disabled = true;
      $("flow-status").textContent = "Dual approval complete — ship to prod.";
    } else {
      $("flow-status").textContent = `Approval ${state.approvalCount}/2 — approve again as another lead/approver.`;
    }
    show({ approvalCount: state.approvalCount });
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("prod").onclick = async () => {
  try {
    const data = await api("POST", `/releases/${state.release.id}/transition`, {
      to: "prod",
      versionNum: state.release.versionNum,
    });
    state.release = data.release;
    $("flow-status").textContent = "Shipped to prod.";
    show(state.release);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};
