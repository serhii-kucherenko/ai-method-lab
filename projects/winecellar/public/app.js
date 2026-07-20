const state = { token: null, bottle: null };
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

function showBottle() {
  $("bottle-view").textContent = state.bottle
    ? JSON.stringify(state.bottle, null, 2)
    : "";
  $("publish").disabled = !(state.bottle && state.bottle.state === "cellared");
  $("archive").disabled = !(state.bottle && state.bottle.state === "tasting");
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
    const data = await api("POST", "/bottles", { title: $("title").value });
    state.bottle = data.bottle;
    $("flow-status").textContent = "Cellareded.";
    showBottle();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/bottles/${state.bottle.id}/transition`, {
      to: "tasting",
      version: state.bottle.version,
    });
    state.bottle = data.bottle;
    $("flow-status").textContent = "Tasting.";
    showBottle();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/bottles/${state.bottle.id}/transition`, {
      to: "emptied",
      version: state.bottle.version,
    });
    state.bottle = data.bottle;
    $("flow-status").textContent = "Emptied.";
    showBottle();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
