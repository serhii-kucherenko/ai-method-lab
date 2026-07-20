const state = { token: null, spot: null };
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

function showSpot() {
  $("spot-view").textContent = state.spot
    ? JSON.stringify(state.spot, null, 2)
    : "";
  $("publish").disabled = !(state.spot && state.spot.state === "reserved");
  $("archive").disabled = !(state.spot && state.spot.state === "in_use");
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
    const data = await api("POST", "/spots", { title: $("title").value });
    state.spot = data.spot;
    $("flow-status").textContent = "Reserveded.";
    showSpot();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/spots/${state.spot.id}/transition`, {
      to: "in_use",
      version: state.spot.version,
    });
    state.spot = data.spot;
    $("flow-status").textContent = "In_use.";
    showSpot();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/spots/${state.spot.id}/transition`, {
      to: "released",
      version: state.spot.version,
    });
    state.spot = data.spot;
    $("flow-status").textContent = "Released.";
    showSpot();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
