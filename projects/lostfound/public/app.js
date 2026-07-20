const state = { token: null, item: null };
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
  $("item-view").textContent = state.item
    ? JSON.stringify(state.item, null, 2)
    : "";
  $("claim").disabled = !(state.item && state.item.state === "reported");
  $("reunite").disabled = !(state.item && state.item.state === "claimed");
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
    const data = await api("POST", "/items", { title: $("title").value });
    state.item = data.item;
    $("flow-status").textContent = "Reported.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("claim").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/items/${state.item.id}/transition`, {
      to: "claimed",
      version: state.item.version,
    });
    state.item = data.item;
    $("flow-status").textContent = "Claimed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("reunite").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/items/${state.item.id}/transition`, {
      to: "reunited",
      version: state.item.version,
    });
    state.item = data.item;
    $("flow-status").textContent = "Reunited.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
