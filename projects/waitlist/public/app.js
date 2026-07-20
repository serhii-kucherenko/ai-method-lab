const state = { token: null, entry: null };
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
  $("entry-view").textContent = state.entry
    ? JSON.stringify(state.entry, null, 2)
    : "";
  $("invite").disabled = !(state.entry && state.entry.state === "waiting");
  $("join").disabled = !(state.entry && state.entry.state === "invited");
}

$("register").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/register", {
      email: $("email").value,
      entryword: $("entryword").value,
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
      entryword: $("entryword").value,
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
    const data = await api("POST", "/entries", { title: $("title").value });
    state.entry = data.entry;
    $("flow-status").textContent = "Waiting.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("invite").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/entries/${state.entry.id}/transition`, {
      to: "invited",
      version: state.entry.version,
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Inviteed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("join").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/entries/${state.entry.id}/transition`, {
      to: "joined",
      version: state.entry.version,
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Joind.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
