const state = { token: null, visit: null };
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

function showClip() {
  $("visit-view").textContent = state.visit
    ? JSON.stringify(state.visit, null, 2)
    : "";
  $("admit").disabled = !(state.visit && state.visit.state === "scheduled");
  $("release").disabled = !(state.visit && state.visit.state === "in_care");
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
    const data = await api("POST", "/visits", { title: $("title").value });
    state.visit = data.visit;
    $("flow-status").textContent = "Scheduled.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("admit").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/visits/${state.visit.id}/transition`, {
      to: "in_care",
      version: state.visit.version,
    });
    state.visit = data.visit;
    $("flow-status").textContent = "Admited.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("release").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/visits/${state.visit.id}/transition`, {
      to: "released",
      version: state.visit.version,
    });
    state.visit = data.visit;
    $("flow-status").textContent = "Released.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
