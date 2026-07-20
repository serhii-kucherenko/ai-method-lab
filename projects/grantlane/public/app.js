const state = {
  token: null,
  programId: null,
  application: null,
  milestone: null,
  reviewerToken: null,
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
    const program = await api("POST", "/programs", { name: $("program-name").value });
    state.programId = program.program.id;
    const reviewer = await api("POST", "/auth/register", {
      email: `rev-${Date.now()}@demo.grantlane.local`,
      password: "demo",
    });
    state.reviewerToken = reviewer.token;
    await api("POST", `/programs/${state.programId}/members`, {
      userId: reviewer.user.id,
      role: "reviewer",
    });
    const application = await api("POST", `/programs/${state.programId}/applications`, {
      orgName: $("org-name").value,
      amountRequested: Number($("amount-requested").value),
    });
    state.application = application.application;
    $("signoff").disabled = false;
    $("flow-status").textContent = "Application submitted — add dual sign-off.";
    show(state.application);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("signoff").onclick = async () => {
  try {
    const headers = { "content-type": "application/json", authorization: `Bearer ${state.token}` };
    await fetch(`/applications/${state.application.id}/sign-off`, {
      method: "POST",
      headers,
    });
    const revHeaders = {
      "content-type": "application/json",
      authorization: `Bearer ${state.reviewerToken}`,
    };
    await fetch(`/applications/${state.application.id}/sign-off`, {
      method: "POST",
      headers: revHeaders,
    });
    const detail = await api("GET", `/applications/${state.application.id}`);
    state.application = detail.application;
    $("activate").disabled = false;
    $("flow-status").textContent = "Dual sign-off complete.";
    show(state.application);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("activate").onclick = async () => {
  try {
    const data = await api("POST", `/applications/${state.application.id}/activate`, {
      approvedAmount: Number($("amount-requested").value),
      version: state.application.version,
    });
    state.application = data.application;
    const milestone = await api("POST", `/applications/${state.application.id}/milestones`, {
      label: "Initial disbursement",
      amount: Math.floor(Number($("amount-requested").value) / 2),
    });
    state.milestone = milestone.milestone;
    $("pay").disabled = false;
    $("flow-status").textContent = "Grant activated with milestone.";
    show({ application: state.application, milestone: state.milestone });
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("pay").onclick = async () => {
  try {
    const data = await api("POST", `/milestones/${state.milestone.id}/pay`);
    state.application = data.application;
    state.milestone = data.milestone;
    $("close").disabled = false;
    $("flow-status").textContent = "Milestone paid.";
    show(data);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("close").onclick = async () => {
  try {
    const data = await api("POST", `/applications/${state.application.id}/close`, {
      version: state.application.version,
    });
    state.application = data.application;
    $("flow-status").textContent = "Grant closed.";
    show(state.application);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};
