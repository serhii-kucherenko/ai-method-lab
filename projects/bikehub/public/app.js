const state = { token: null, bike: null };
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
  $("bike-view").textContent = state.bike
    ? JSON.stringify(state.bike, null, 2)
    : "";
  $("rent").disabled = !(state.bike && state.bike.state === "docked");
  $("redock").disabled = !(state.bike && state.bike.state === "rented");
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
    const data = await api("POST", "/bikes", { title: $("title").value });
    state.bike = data.bike;
    $("flow-status").textContent = "Docked.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("rent").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/bikes/${state.bike.id}/transition`, {
      to: "rented",
      version: state.bike.version,
    });
    state.bike = data.bike;
    $("flow-status").textContent = "Rented.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("redock").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/bikes/${state.bike.id}/transition`, {
      to: "redocked",
      version: state.bike.version,
    });
    state.bike = data.bike;
    $("flow-status").textContent = "Redockd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
