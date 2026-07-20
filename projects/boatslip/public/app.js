const state = { token: null, berth: null };
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

function showBerth() {
  $("berth-view").textContent = state.berth
    ? JSON.stringify(state.berth, null, 2)
    : "";
  $("publish").disabled = !(state.berth && state.berth.state === "reserved");
  $("archive").disabled = !(state.berth && state.berth.state === "moored");
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
    const data = await api("POST", "/berths", { title: $("title").value });
    state.berth = data.berth;
    $("flow-status").textContent = "Reserveded.";
    showBerth();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/berths/${state.berth.id}/transition`, {
      to: "moored",
      version: state.berth.version,
    });
    state.berth = data.berth;
    $("flow-status").textContent = "Moored.";
    showBerth();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/berths/${state.berth.id}/transition`, {
      to: "departed",
      version: state.berth.version,
    });
    state.berth = data.berth;
    $("flow-status").textContent = "Departed.";
    showBerth();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
