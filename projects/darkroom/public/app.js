const state = { token: null, roll: null };
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

function showRoll() {
  $("roll-view").textContent = state.roll
    ? JSON.stringify(state.roll, null, 2)
    : "";
  $("publish").disabled = !(state.roll && state.roll.state === "loaded");
  $("archive").disabled = !(state.roll && state.roll.state === "developing");
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
    const data = await api("POST", "/rolls", { title: $("title").value });
    state.roll = data.roll;
    $("flow-status").textContent = "Loadeded.";
    showRoll();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/rolls/${state.roll.id}/transition`, {
      to: "developing",
      version: state.roll.version,
    });
    state.roll = data.roll;
    $("flow-status").textContent = "Developing.";
    showRoll();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/rolls/${state.roll.id}/transition`, {
      to: "scanned",
      version: state.roll.version,
    });
    state.roll = data.roll;
    $("flow-status").textContent = "Scanned.";
    showRoll();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
