const state = { token: null, request: null };
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
  $("publish").disabled = !(state.request && state.request.state === "posted");
  $("archive").disabled = !(state.request && state.request.state === "claimed");
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
    const data = await api("POST", "/requests", { title: $("title").value });
    state.request = data.request;
    $("flow-status").textContent = "Posteded.";
    showRequest();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/requests/${state.request.id}/transition`, {
      to: "claimed",
      version: state.request.version,
    });
    state.request = data.request;
    $("flow-status").textContent = "Claimed.";
    showRequest();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/requests/${state.request.id}/transition`, {
      to: "resolved",
      version: state.request.version,
    });
    state.request = data.request;
    $("flow-status").textContent = "Resolved.";
    showRequest();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
