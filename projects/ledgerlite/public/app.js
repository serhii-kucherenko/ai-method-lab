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
  $("submit").disabled = !(state.entry && state.entry.state === "draft");
  $("approve").disabled = !(state.entry && state.entry.state === "in_review");
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
    const data = await api("POST", "/entries", {
      memo: $("memo").value,
      amount: Number($("amount").value),
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Draft created.";
    showEntry();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("submit").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/entries/${state.entry.id}/transition`, {
      to: "in_review",
      version: state.entry.version,
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Submitted.";
    showEntry();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("approve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/entries/${state.entry.id}/transition`, {
      to: "approved",
      version: state.entry.version,
    });
    state.entry = data.entry;
    $("flow-status").textContent = "Approved.";
    showEntry();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
