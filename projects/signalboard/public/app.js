const state = { token: null, status: null };
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
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function show() {
  $("status-view").textContent = state.status
    ? JSON.stringify(state.status, null, 2)
    : "";
  $("submit").disabled = !(state.status && state.status.state === "draft");
  $("approve").disabled = !(state.status && state.status.state === "in_review");
}

$("register").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/register", {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = "Registered.";
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = String(err.message || err);
  }
});

$("login").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/login", {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = "Logged in.";
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = String(err.message || err);
  }
});

$("create").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/statuses", {
      title: $("title").value,
      body: $("body").value,
    });
    state.status = data.status;
    $("flow-status").textContent = "Draft created.";
    show();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("submit").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/statuses/${state.status.id}/transition`, {
      to: "in_review",
      version: state.status.version,
    });
    state.status = data.status;
    $("flow-status").textContent = "Submitted.";
    show();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("approve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/statuses/${state.status.id}/transition`, {
      to: "approved",
      version: state.status.version,
    });
    state.status = data.status;
    $("flow-status").textContent = "Published.";
    show();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
