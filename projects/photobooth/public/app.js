const state = { token: null, session: null };
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
  $("session-view").textContent = state.session
    ? JSON.stringify(state.session, null, 2)
    : "";
  $("shoot").disabled = !(state.session && state.session.state === "ready");
  $("print").disabled = !(state.session && state.session.state === "shooting");
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
    const data = await api("POST", "/sessions", { title: $("title").value });
    state.session = data.session;
    $("flow-status").textContent = "Ready.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("shoot").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/sessions/${state.session.id}/transition`, {
      to: "shooting",
      version: state.session.version,
    });
    state.session = data.session;
    $("flow-status").textContent = "Shooted.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("print").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/sessions/${state.session.id}/transition`, {
      to: "printed",
      version: state.session.version,
    });
    state.session = data.session;
    $("flow-status").textContent = "Printd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
