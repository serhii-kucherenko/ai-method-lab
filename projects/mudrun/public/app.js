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

function showEntry() {
  $("entry-view").textContent = state.entry
    ? JSON.stringify(state.entry, null, 2)
    : "";
  $("publish").disabled = !(state.entry && state.entry.state === "registered");
  $("archive").disabled = !(state.entry && state.entry.state === "started");
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
    const data = await api("POST", "/entries", { title: $("title").value });
    state.entry = data.entry;
    $("flow-status").textContent = "Registereded.";
    showEntry();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/entries/${state.entry.id}/transition`, {
      to: "started",
      version: state.entry.version,
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Started.";
    showEntry();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/entries/${state.entry.id}/transition`, {
      to: "finished",
      version: state.entry.version,
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Finished.";
    showEntry();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
