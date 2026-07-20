const state = {
  token: null,
  request: null,
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
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function showRequest() {
  $("request-view").textContent = state.request
    ? JSON.stringify(state.request, null, 2)
    : "";
  $("submit").disabled = !(state.request && state.request.state === "draft");
  $("approve").disabled = !(state.request && state.request.state === "in_review");
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
    const data = await api("POST", "/requests", {
      title: $("title").value,
      body: $("body").value,
    });
    state.request = data.request;
    $("flow-status").textContent = "Draft created.";
    showRequest();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("submit").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/requests/${state.request.id}/transition`, {
      to: "in_review",
      version: state.request.version,
    });
    state.request = data.request;
    $("flow-status").textContent = "Submitted for review.";
    showRequest();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("approve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/requests/${state.request.id}/transition`, {
      to: "approved",
      version: state.request.version,
    });
    state.request = data.request;
    $("flow-status").textContent = "Approved.";
    showRequest();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
