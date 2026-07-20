const state = { token: null, load: null };
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

function showLoad() {
  $("load-view").textContent = state.load
    ? JSON.stringify(state.load, null, 2)
    : "";
  $("publish").disabled = !(state.load && state.load.state === "staged");
  $("archive").disabled = !(state.load && state.load.state === "firing");
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
    const data = await api("POST", "/loads", { title: $("title").value });
    state.load = data.load;
    $("flow-status").textContent = "Stageded.";
    showLoad();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/loads/${state.load.id}/transition`, {
      to: "firing",
      version: state.load.version,
    });
    state.load = data.load;
    $("flow-status").textContent = "Firing.";
    showLoad();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/loads/${state.load.id}/transition`, {
      to: "cooled",
      version: state.load.version,
    });
    state.load = data.load;
    $("flow-status").textContent = "Cooled.";
    showLoad();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
