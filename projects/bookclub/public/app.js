const state = { token: null, pick: null };
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

function showPick() {
  $("pick-view").textContent = state.pick
    ? JSON.stringify(state.pick, null, 2)
    : "";
  $("publish").disabled = !(state.pick && state.pick.state === "nominated");
  $("archive").disabled = !(state.pick && state.pick.state === "reading");
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
    const data = await api("POST", "/picks", { title: $("title").value });
    state.pick = data.pick;
    $("flow-status").textContent = "Nominateded.";
    showPick();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/picks/${state.pick.id}/transition`, {
      to: "reading",
      version: state.pick.version,
    });
    state.pick = data.pick;
    $("flow-status").textContent = "Reading.";
    showPick();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/picks/${state.pick.id}/transition`, {
      to: "discussed",
      version: state.pick.version,
    });
    state.pick = data.pick;
    $("flow-status").textContent = "Discussed.";
    showPick();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
