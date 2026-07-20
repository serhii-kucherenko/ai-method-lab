const state = { token: null, fob: null };
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
  $("fob-view").textContent = state.fob
    ? JSON.stringify(state.fob, null, 2)
    : "";
  $("activate").disabled = !(state.fob && state.fob.state === "issued");
  $("revoke").disabled = !(state.fob && state.fob.state === "active");
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
    const data = await api("POST", "/fobs", { title: $("title").value });
    state.fob = data.fob;
    $("flow-status").textContent = "Issued.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("activate").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/fobs/${state.fob.id}/transition`, {
      to: "active",
      version: state.fob.version,
    });
    state.fob = data.fob;
    $("flow-status").textContent = "Activateed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("revoke").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/fobs/${state.fob.id}/transition`, {
      to: "revoked",
      version: state.fob.version,
    });
    state.fob = data.fob;
    $("flow-status").textContent = "Revoked.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
